import * as React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Check, AlertTriangle, X, HelpCircle, Search, ArrowRight, Sun, Moon } from "lucide-react";
import complianceData from "@/docs/registry/compliance.json";
import { componentRegistry } from "@/docs/registry/components";
import { WexInput, WexButton, WexDialog } from "@/components/wex";

/**
 * AccessibilityPage - Dashboard for accessibility test results
 *
 * Features:
 * - KPI tiles showing pass/partial/fail counts
 * - Top issues breakdown
 * - Searchable/sortable components table with light/dark mode columns
 * - Modal dialog for component details (via ?component=<registryKey>)
 *
 * FRAMING: Uses "signal" language only - NOT compliance certification
 */

interface ModeResult {
  status: "pass" | "partial" | "fail" | "no_examples" | "pending";
  levelAchieved?: string | null;
  violations: number;
  issues: string[];
  examplesFound: number;
}

interface ComplianceEntry {
  status: "pass" | "partial" | "fail" | "no_examples" | "pending";
  levelAchieved?: string | null;
  violations: number;
  issues: string[];
  testedAt: string;
  scope: string;
  examplesFound: number;
  scenariosTested: string[];
  subject: string;
  modes?: {
    light: ModeResult | null;
    dark: ModeResult | null;
  };
}

type ComplianceData = Record<string, ComplianceEntry | { description: string }>;

/**
 * Issue Fixability Reference
 * 
 * Provides context about each known issue type to help developers understand:
 * - What the issue is and why it occurs
 * - Whether it's fixable at our level
 * - How to address it (if applicable)
 */
interface IssueInfo {
  title: string;
  description: string;
  fixable: "yes" | "partial" | "no" | "workaround";
  fixableLabel: string;
  guidance: string;
}

const ISSUE_REFERENCE: Record<string, IssueInfo> = {
  "svg-img-alt": {
    title: "SVG Image Alt Text",
    description: "SVG elements with role=\"img\" must have an accessible name via aria-label, aria-labelledby, or title element.",
    fixable: "yes",
    fixableLabel: "Fixable",
    guidance: "Add aria-label or title element to the SVG. For decorative SVGs, use aria-hidden=\"true\".",
  },
  "aria-required-children": {
    title: "ARIA Required Children",
    description: "Certain ARIA roles require specific child roles. This often occurs with third-party libraries (e.g., cmdk) that use ARIA roles without proper structure.",
    fixable: "no",
    fixableLabel: "Third-party library",
    guidance: "This issue originates from an upstream library (cmdk). Monitor for library updates or consider filing an issue with the maintainers.",
  },
  "aria-allowed-attr": {
    title: "ARIA Allowed Attributes",
    description: "An ARIA attribute is used on an element where it's not permitted. Often caused by third-party libraries applying ARIA attributes incorrectly.",
    fixable: "workaround",
    fixableLabel: "Workaround available",
    guidance: "Add appropriate aria-label to provide context. The underlying issue is in react-resizable-panels library.",
  },
  "aria-input-field-name": {
    title: "ARIA Input Field Name",
    description: "Input elements (including sliders) must have an accessible name via aria-label, aria-labelledby, or associated label element.",
    fixable: "yes",
    fixableLabel: "Fixable",
    guidance: "Add aria-label to the Slider component or associate it with a visible label using aria-labelledby.",
  },
  "color-contrast": {
    title: "Color Contrast",
    description: "Text or UI elements don't meet WCAG contrast ratio requirements (4.5:1 for normal text, 3:1 for large text).",
    fixable: "yes",
    fixableLabel: "Fixable",
    guidance: "Adjust foreground/background color pairings using semantic tokens. Often requires updating --muted-foreground or component variant colors.",
  },
  "button-name": {
    title: "Button Name",
    description: "Button elements must have discernible text that describes the action. Icon-only buttons need aria-label.",
    fixable: "yes",
    fixableLabel: "Fixable",
    guidance: "Add aria-label to icon-only buttons or associate with a visible label using aria-labelledby.",
  },
  "scrollable-region-focusable": {
    title: "Scrollable Region Focusable",
    description: "Scrollable content areas must be keyboard accessible so users can scroll without a mouse.",
    fixable: "yes",
    fixableLabel: "Fixable",
    guidance: "Add tabIndex={0} to the scrollable container to make it focusable.",
  },
};

// Extract metadata and component data
const allData = complianceData as ComplianceData;
const meta = allData._meta as { lastUpdated?: string; totalComponents?: number; modes?: string[] } | undefined;
const componentData: Record<string, ComplianceEntry> = {};

Object.entries(allData).forEach(([key, value]) => {
  if (key !== "_meta" && value && typeof value === "object" && "status" in value) {
    componentData[key] = value as ComplianceEntry;
  }
});

// Get registry key from component route
function getRegistryKeyFromRoute(route: string): string {
  const match = route.match(/\/components\/(.+)$/);
  return match ? match[1] : route.replace(/\//g, "-");
}

// Build a map of registryKey -> component info
const componentMap = new Map<string, { name: string; route: string }>();
componentRegistry.forEach((comp) => {
  const key = getRegistryKeyFromRoute(comp.route);
  componentMap.set(key, { name: comp.name, route: comp.route });
});

export default function AccessibilityPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedComponent = searchParams.get("component");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"name" | "status" | "violations">("name");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

  const isDialogOpen = !!selectedComponent;

  // Calculate KPIs
  const stats = React.useMemo(() => {
    let pass = 0;
    let partial = 0;
    let fail = 0;
    let noExamples = 0;
    const allIssues: string[] = [];

    Object.values(componentData).forEach((entry) => {
      if (entry.status === "pass") pass++;
      else if (entry.status === "partial") partial++;
      else if (entry.status === "fail") fail++;
      else if (entry.status === "no_examples") noExamples++;
      
      allIssues.push(...entry.issues);
    });

    const issueCounts = allIssues.reduce((acc, issue) => {
      acc[issue] = (acc[issue] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topIssues = Object.entries(issueCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { pass, partial, fail, noExamples, total: Object.keys(componentData).length, topIssues };
  }, []);

  // Filter and sort components
  const filteredComponents = React.useMemo(() => {
    let components = Object.entries(componentData).map(([key, data]) => ({
      key,
      ...data,
      name: componentMap.get(key)?.name || key,
      route: componentMap.get(key)?.route || `/components/${key}`,
    }));

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      components = components.filter(
        (c) => c.name.toLowerCase().includes(query) || c.key.toLowerCase().includes(query)
      );
    }

    components.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "status") {
        const statusOrder = { pass: 0, partial: 1, fail: 2, no_examples: 3, pending: 4 };
        comparison = (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4);
      } else if (sortBy === "violations") {
        comparison = (a.violations || 0) - (b.violations || 0);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return components;
  }, [searchQuery, sortBy, sortOrder]);

  const selectedData = selectedComponent ? componentData[selectedComponent] : null;
  const selectedInfo = selectedComponent ? componentMap.get(selectedComponent) : null;

  function closeDialog() {
    setSearchParams({});
  }

  function openDetails(registryKey: string) {
    setSearchParams({ component: registryKey });
  }

  function handleSort(column: "name" | "status" | "violations") {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  }

  return (
    <article>
      <header className="mb-8 pb-6 border-b border-border">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Accessibility Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Automated accessibility test results for WEX Design System components.
          Tests run in both light and dark modes. These are test signals based on axe-core analysis, not compliance certifications.
        </p>
        {meta?.lastUpdated && (
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {new Date(meta.lastUpdated).toLocaleDateString()}
          </p>
        )}
      </header>

      {/* KPI Tiles */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiTile label="Tested" value={stats.total} icon={<HelpCircle className="h-5 w-5" />} />
        <KpiTile label="Passing" value={stats.pass} icon={<Check className="h-5 w-5 text-success" />} variant="success" />
        <KpiTile label="Partial" value={stats.partial} icon={<AlertTriangle className="h-5 w-5 text-warning" />} variant="warning" />
        <KpiTile label="Failing" value={stats.fail} icon={<X className="h-5 w-5 text-destructive" />} variant="destructive" />
      </section>

      {/* Top Issues */}
      {stats.topIssues.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-3">Top Issues</h2>
          <div className="flex flex-wrap gap-2">
            {stats.topIssues.map(([issue, count]) => (
              <span
                key={issue}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-sm text-foreground"
              >
                <code className="text-xs">{issue}</code>
                <span className="text-muted-foreground">×{count}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* How to Run Tests */}
      <section className="mb-8 p-4 rounded-lg border border-border bg-card">
        <h2 className="text-sm font-semibold text-foreground mb-2">How to Run Tests</h2>
        <p className="text-sm text-muted-foreground mb-2">
          Generate accessibility test results by running:
        </p>
        <code className="block bg-muted px-3 py-2 rounded text-sm font-mono text-foreground">
          npm run test:a11y
        </code>
      </section>

      {/* Components Table */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">All Components</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <WexInput
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th
                  className="text-left px-4 py-3 text-sm font-medium text-foreground cursor-pointer hover:bg-muted"
                  onClick={() => handleSort("name")}
                >
                  Component {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="text-left px-4 py-3 text-sm font-medium text-foreground cursor-pointer hover:bg-muted"
                  onClick={() => handleSort("status")}
                >
                  Combined {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Sun className="h-3 w-3" /> Light
                  </span>
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Moon className="h-3 w-3" /> Dark
                  </span>
                </th>
                <th
                  className="text-left px-4 py-3 text-sm font-medium text-foreground cursor-pointer hover:bg-muted"
                  onClick={() => handleSort("violations")}
                >
                  Total {sortBy === "violations" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredComponents.map((comp) => (
                <tr
                  key={comp.key}
                  tabIndex={0}
                  role="button"
                  onClick={() => openDetails(comp.key)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openDetails(comp.key)}
                  className={`hover:bg-muted/50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${selectedComponent === comp.key ? "bg-primary/5" : ""}`}
                >
                  <td className="px-4 py-3 text-sm text-foreground font-medium">
                    {comp.name}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={comp.status} />
                  </td>
                  <td className="px-4 py-3">
                    {comp.modes?.light ? (
                      <MiniStatusBadge status={comp.modes.light.status} violations={comp.modes.light.violations} />
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {comp.modes?.dark ? (
                      <MiniStatusBadge status={comp.modes.dark.status} violations={comp.modes.dark.violations} />
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {comp.violations}
                  </td>
                </tr>
              ))}
              {filteredComponents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No components found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Component Details Modal */}
      <WexDialog open={isDialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <WexDialog.Content className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedComponent && (
            <ComponentDetailContent
              registryKey={selectedComponent}
              data={selectedData}
              info={selectedInfo}
              onClose={closeDialog}
            />
          )}
        </WexDialog.Content>
      </WexDialog>
    </article>
  );
}

// --- Sub-components ---

interface KpiTileProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  variant?: "success" | "warning" | "destructive";
}

function KpiTile({ label, value, icon, variant }: KpiTileProps) {
  const bgClass = variant === "success" 
    ? "bg-success/10" 
    : variant === "warning" 
    ? "bg-warning/10" 
    : variant === "destructive" 
    ? "bg-destructive/10" 
    : "bg-muted";

  return (
    <div className={`rounded-lg border border-border p-4 ${bgClass}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        {icon}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

interface StatusBadgeProps {
  status: ComplianceEntry["status"];
}

function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    pass: { label: "Pass", className: "border-success/50 bg-success/10 text-success" },
    partial: { label: "Partial", className: "border-warning/50 bg-warning/10 text-warning" },
    fail: { label: "Fail", className: "border-destructive/50 bg-destructive/10 text-destructive" },
    no_examples: { label: "No Examples", className: "border-warning/50 bg-warning/10 text-warning" },
    pending: { label: "Pending", className: "border-border bg-muted text-muted-foreground" },
  }[status] || { label: status, className: "border-border bg-muted text-muted-foreground" };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium tracking-wide rounded border ${config.className}`}>
      {config.label}
    </span>
  );
}

interface MiniStatusBadgeProps {
  status: ModeResult["status"];
  violations: number;
}

function MiniStatusBadge({ status, violations }: MiniStatusBadgeProps) {
  const icon = status === "pass" 
    ? <Check className="h-3 w-3 text-success" />
    : status === "partial"
    ? <AlertTriangle className="h-3 w-3 text-warning" />
    : status === "fail"
    ? <X className="h-3 w-3 text-destructive" />
    : <HelpCircle className="h-3 w-3 text-muted-foreground" />;

  return (
    <span className="inline-flex items-center gap-1 text-xs">
      {icon}
      <span className="text-muted-foreground">({violations})</span>
    </span>
  );
}

interface ComponentDetailContentProps {
  registryKey: string;
  data: ComplianceEntry | null;
  info: { name: string; route: string } | null | undefined;
  onClose: () => void;
}

function ComponentDetailContent({ registryKey, data, info, onClose }: ComponentDetailContentProps) {
  const componentName = info?.name || registryKey;
  const componentRoute = info?.route || `/components/${registryKey}`;

  if (!data) {
    return (
      <>
        <WexDialog.Header>
          <div className="flex items-center justify-between">
            <WexDialog.Title>{componentName}</WexDialog.Title>
            <Link
              to={componentRoute}
              onClick={onClose}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              View docs <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <WexDialog.Description className="sr-only">
            Accessibility test results for {componentName}
          </WexDialog.Description>
        </WexDialog.Header>
        
        <div className="flex items-center gap-3 py-4">
          <div className="p-2 rounded-full bg-muted">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">Not Tested</p>
            <p className="text-sm text-muted-foreground">
              Run <code className="bg-muted px-1 rounded text-xs">npm run test:a11y</code> to generate results.
            </p>
          </div>
        </div>
      </>
    );
  }

  const testedDate = data.testedAt ? new Date(data.testedAt).toLocaleDateString() : "Never";
  
  // Pre-calculate variants (filter out auto-generated IDs)
  const variants = data.scenariosTested.filter(s => 
    !s.startsWith("example-_r_") && !/^example-\d+$/.test(s)
  );

  return (
    <>
      <WexDialog.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WexDialog.Title>{componentName}</WexDialog.Title>
            <StatusBadge status={data.status} />
          </div>
          <Link
            to={componentRoute}
            onClick={onClose}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            View docs <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <WexDialog.Description className="sr-only">
          Accessibility test results for {componentName}
        </WexDialog.Description>
      </WexDialog.Header>

      <div className="space-y-4">
        {/* Compact Mode Results + Stats Row */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {/* Light Mode */}
          <div className={`p-2 rounded-lg border ${data.modes?.light?.status === 'pass' ? 'border-success/30 bg-success/5' : data.modes?.light?.status === 'fail' ? 'border-destructive/30 bg-destructive/5' : 'border-border bg-muted/30'}`}>
            <Sun className="h-3 w-3 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs font-medium">{data.modes?.light?.violations ?? 0}</p>
          </div>
          {/* Dark Mode */}
          <div className={`p-2 rounded-lg border ${data.modes?.dark?.status === 'pass' ? 'border-success/30 bg-success/5' : data.modes?.dark?.status === 'fail' ? 'border-destructive/30 bg-destructive/5' : 'border-border bg-muted/30'}`}>
            <Moon className="h-3 w-3 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs font-medium">{data.modes?.dark?.violations ?? 0}</p>
          </div>
          {/* WCAG Level */}
          <div className="p-2 rounded-lg border border-border bg-muted/30">
            <p className="text-[10px] text-muted-foreground">Level</p>
            <p className="text-xs font-medium">{data.levelAchieved || '—'}</p>
          </div>
          {/* Variants */}
          <div className="p-2 rounded-lg border border-border bg-muted/30">
            <p className="text-[10px] text-muted-foreground">Variants</p>
            <p className="text-xs font-medium">{variants.length || data.examplesFound}</p>
          </div>
        </div>

        {/* Variants List - only if meaningful */}
        {variants.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {variants.map((variant) => (
              <code key={variant} className="px-1.5 py-0.5 bg-muted rounded text-[10px] text-foreground">
                {variant}
              </code>
            ))}
          </div>
        )}

        {/* Issues - Compact Cards */}
        {data.issues.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground">Issues</p>
            {data.issues.map((issue) => {
              const issueInfo = ISSUE_REFERENCE[issue];
              return (
                <div key={issue} className="p-2 rounded border border-border bg-card text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <X className="h-3 w-3 text-destructive flex-shrink-0" />
                      <code className="font-mono">{issue}</code>
                    </div>
                    {issueInfo && <FixabilityBadge fixable={issueInfo.fixable} label={issueInfo.fixableLabel} />}
                  </div>
                  {issueInfo && (
                    <p className="mt-1.5 text-muted-foreground pl-4">{issueInfo.guidance}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Compact Footer Note */}
        <p className="text-[10px] text-muted-foreground text-center pt-2 border-t border-border">
          Tested {testedDate} · Automated axe-core analysis · Not a compliance certification
        </p>
      </div>
    </>
  );
}

interface FixabilityBadgeProps {
  fixable: IssueInfo["fixable"];
  label: string;
}

function FixabilityBadge({ fixable, label }: FixabilityBadgeProps) {
  const config = {
    yes: { className: "bg-success/10 text-success border-success/30" },
    partial: { className: "bg-warning/10 text-warning border-warning/30" },
    workaround: { className: "bg-info/10 text-info border-info/30" },
    no: { className: "bg-muted text-muted-foreground border-border" },
  }[fixable];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${config.className}`}>
      {label}
    </span>
  );
}

