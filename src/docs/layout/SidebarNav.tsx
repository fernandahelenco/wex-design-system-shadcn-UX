import * as React from "react";
import { useLocation } from "react-router-dom";
import { DocsNavLink } from "@/docs/components/NavLink";
import { componentRegistry } from "@/docs/registry/components";
import { foundationRegistry } from "@/docs/registry/foundations";
import { categoryConfig, type ComponentCategory } from "@/docs/registry/types";
import { Home, Users, Layers, LayoutGrid, BookOpen, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Navigation sections rendered from registries
 * 
 * 3-Level Hierarchy:
 * - Level 1: Section headers (OVERVIEW, ABOUT, FOUNDATIONS, COMPONENTS, RESOURCES)
 * - Level 2: Index/group pages (Home, Getting Started, Accessibility, Story, etc.)
 * - Level 3: Component/foundation pages (Button, Input, Colors, etc.)
 * 
 * Components are grouped by category within the Components section.
 * Status badges are NOT shown in navigation - they appear on component pages.
 */

// Group components by category
function getGroupedComponents() {
  const grouped = new Map<ComponentCategory, typeof componentRegistry>();
  
  // Initialize groups in order
  const categories = Object.keys(categoryConfig) as ComponentCategory[];
  categories.sort((a, b) => categoryConfig[a].order - categoryConfig[b].order);
  
  for (const category of categories) {
    grouped.set(category, []);
  }
  
  // Assign components to groups
  for (const component of componentRegistry) {
    const group = grouped.get(component.category);
    if (group) {
      group.push(component);
    }
  }
  
  // Sort components alphabetically within each group
  for (const [, components] of grouped) {
    components.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  return grouped;
}

export function SidebarNav() {
  const location = useLocation();
  
  // Auto-expand sections based on current route
  const isFoundationsRoute = location.pathname.startsWith("/foundations");
  const isComponentsRoute = location.pathname.startsWith("/components");
  
  const groupedComponents = React.useMemo(() => getGroupedComponents(), []);

  return (
    <div className="space-y-2">
      {/* Overview Section - Level 2 pages (always open) */}
      <NavSection title="Overview" icon={<Home className="h-3.5 w-3.5" />} color="blue">
        <DocsNavLink to="/getting-started" level={2}>Getting Started</DocsNavLink>
        <DocsNavLink to="/architecture" level={2}>Architecture</DocsNavLink>
      </NavSection>

      {/* About Section - First-class pages (always open) */}
      <NavSection title="About" icon={<Users className="h-3.5 w-3.5" />} color="violet">
        <DocsNavLink to="/accessibility" level={2}>Accessibility</DocsNavLink>
        <DocsNavLink to="/story" level={2}>Story</DocsNavLink>
      </NavSection>

      {/* Foundations Section - Collapsible */}
      <CollapsibleNavSection 
        title="Foundations" 
        icon={<Layers className="h-3.5 w-3.5" />} 
        color="amber"
        defaultOpen={isFoundationsRoute}
        itemCount={foundationRegistry.length}
      >
        {foundationRegistry.map((item) => (
          <DocsNavLink key={item.route} to={item.route} level={3}>
            {item.name}
          </DocsNavLink>
        ))}
      </CollapsibleNavSection>

      {/* Components Section - Collapsible with category groupings */}
      <CollapsibleNavSection 
        title="Components" 
        icon={<LayoutGrid className="h-3.5 w-3.5" />} 
        color="emerald"
        defaultOpen={isComponentsRoute}
        itemCount={componentRegistry.length}
      >
        {Array.from(groupedComponents.entries()).map(([category, components]) => (
          components.length > 0 && (
            <div key={category} className="mb-2 last:mb-0">
              {/* Category sub-heading */}
              <div className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                {categoryConfig[category].label}
              </div>
              {/* Components in this category */}
              {components.map((item) => (
                <DocsNavLink key={item.route} to={item.route} level={3}>
                  {item.name}
                </DocsNavLink>
              ))}
            </div>
          )
        ))}
      </CollapsibleNavSection>

      {/* Resources Section - Level 2 pages (always open) */}
      <NavSection title="Resources" icon={<BookOpen className="h-3.5 w-3.5" />} color="rose">
      
        <DocsNavLink to="/contributing" level={2}>Contributing</DocsNavLink>
        <DocsNavLink to="/theme-builder" level={2}>Theme Builder</DocsNavLink>
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
 * Level 1 - Section header (always open)
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

interface CollapsibleNavSectionProps extends NavSectionProps {
  defaultOpen?: boolean;
  itemCount?: number;
}

/**
 * Level 1 - Collapsible section header
 * For large sections like Components and Foundations
 * Auto-expands when navigating to a child route
 */
function CollapsibleNavSection({ 
  title, 
  icon, 
  color, 
  children, 
  defaultOpen = false,
  itemCount 
}: CollapsibleNavSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  
  // Update open state when defaultOpen changes (route-based)
  React.useEffect(() => {
    if (defaultOpen) {
      setIsOpen(true);
    }
  }, [defaultOpen]);

  return (
    <div className="pt-6 first:pt-0 border-t border-border/40 first:border-t-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2 hover:text-foreground transition-colors group"
        aria-expanded={isOpen}
      >
        <span className={sectionColors[color]}>{icon}</span>
        {title}
        {itemCount !== undefined && (
          <span className="text-[10px] font-normal text-muted-foreground/60">
            ({itemCount})
          </span>
        )}
        <ChevronDown className={cn(
          "h-3 w-3 ml-auto transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>
      <div 
        className={cn(
          "space-y-0.5 overflow-hidden transition-all duration-200",
          isOpen ? "opacity-100" : "opacity-0 h-0"
        )}
      >
        {children}
      </div>
    </div>
  );
}
