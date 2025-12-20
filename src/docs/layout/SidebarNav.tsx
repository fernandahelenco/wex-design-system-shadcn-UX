import { DocsNavLink } from "@/docs/components/NavLink";
import { componentRegistry } from "@/docs/registry/components";
import { foundationRegistry } from "@/docs/registry/foundations";
import { Home, Users, Layers, LayoutGrid, BookOpen } from "lucide-react";

/**
 * Navigation sections rendered from registries
 * 
 * 3-Level Hierarchy:
 * - Level 1: Section headers (OVERVIEW, ABOUT, FOUNDATIONS, COMPONENTS, RESOURCES)
 * - Level 2: Index/group pages (Home, Getting Started, Accessibility, Story, etc.)
 * - Level 3: Component/foundation pages (Button, Input, Colors, etc.)
 * 
 * Status badges are NOT shown in navigation - they appear on component pages.
 */
export function SidebarNav() {
  return (
    <div className="space-y-2">
      {/* Overview Section - Level 2 pages */}
      <NavSection title="Overview" icon={<Home className="h-3.5 w-3.5" />} color="blue">
        <DocsNavLink to="/" level={2}>Home</DocsNavLink>
        <DocsNavLink to="/getting-started" level={2}>Getting Started</DocsNavLink>
      </NavSection>

      {/* About Section - First-class pages moved before Foundations */}
      <NavSection title="About" icon={<Users className="h-3.5 w-3.5" />} color="violet">
        <DocsNavLink to="/accessibility" level={2}>Accessibility</DocsNavLink>
        <DocsNavLink to="/story" level={2}>Story</DocsNavLink>
      </NavSection>

      {/* Foundations Section - Level 3 pages */}
      <NavSection title="Foundations" icon={<Layers className="h-3.5 w-3.5" />} color="amber">
        {foundationRegistry.map((item) => (
          <DocsNavLink key={item.route} to={item.route} level={3}>
            {item.name}
          </DocsNavLink>
        ))}
      </NavSection>

      {/* Components Section - Level 3 pages */}
      <NavSection title="Components" icon={<LayoutGrid className="h-3.5 w-3.5" />} color="emerald">
        {componentRegistry.map((item) => (
          <DocsNavLink key={item.route} to={item.route} level={3}>
            {item.name}
          </DocsNavLink>
        ))}
      </NavSection>

      {/* Resources Section - Level 2 pages */}
      <NavSection title="Resources" icon={<BookOpen className="h-3.5 w-3.5" />} color="rose">
        <DocsNavLink to="/contributing" level={2}>Contributing</DocsNavLink>
        <DocsNavLink to="/unit-tests" level={2}>Unit Tests</DocsNavLink>
        <DocsNavLink to="/changelog" level={2}>Changelog</DocsNavLink>
      </NavSection>
    </div>
  );
}

const sectionColors = {
  blue: "text-blue-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  emerald: "text-emerald-500",
  rose: "text-rose-500",
} as const;

interface NavSectionProps {
  title: string;
  icon: React.ReactNode;
  color: keyof typeof sectionColors;
  children: React.ReactNode;
}

/**
 * Level 1 - Section header
 * Styled as uppercase, smaller text, with clear visual separation
 * Includes colored icon for hierarchy distinction
 */
function NavSection({ title, icon, color, children }: NavSectionProps) {
  return (
    <div className="pt-6 first:pt-0 border-t border-border/40 first:border-t-0">
      <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <span className={sectionColors[color]}>{icon}</span>
        {title}
      </h2>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
