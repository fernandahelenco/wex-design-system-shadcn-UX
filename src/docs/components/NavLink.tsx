import * as React from "react";
import { NavLink as RouterNavLink, type NavLinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface DocsNavLinkProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  /**
   * Navigation level for visual hierarchy:
   * - Level 2: Index/group pages (Home, Getting Started) - medium weight
   * - Level 3: Leaf pages (Button, Input, etc.) - normal weight, indented
   */
  level?: 2 | 3;
}

/**
 * Accessible navigation link for docs sidebar
 * 
 * Visual hierarchy:
 * - Level 2 links are for main navigation items (bolder, more prominent)
 * - Level 3 links are for component/foundation pages (indented, lighter)
 * 
 * Accessibility:
 * - Applies aria-current="page" for active state (handled by React Router)
 * - Includes visible focus ring pattern per WEX rules
 */
export const DocsNavLink = React.forwardRef<HTMLAnchorElement, DocsNavLinkProps>(
  ({ className, children, level = 3, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        className={({ isActive }) =>
          cn(
            // Base styles
            "block text-sm rounded-md transition-colors",
            // Level-based styling
            level === 2 && "px-3 py-2 font-medium",
            level === 3 && "px-3 py-1.5 pl-5", // indented for hierarchy
            // Text color
            "text-foreground",
            // Hover state - lighter blue tint matching brand
            "hover:bg-primary/5 hover:text-primary",
            // Active state - subtle blue
            isActive && "bg-primary/8 text-primary",
            isActive && level === 2 && "font-semibold",
            isActive && level === 3 && "font-medium",
            // Focus ring - matches WexButton pattern
            "focus-visible:outline-none",
            "focus-visible:ring-[length:var(--wex-focus-ring-width)]",
            "focus-visible:ring-ring",
            "focus-visible:ring-offset-[length:var(--wex-focus-ring-offset)]",
            "focus-visible:ring-offset-background",
            className
          )
        }
        {...props}
      >
        {children}
      </RouterNavLink>
    );
  }
);

DocsNavLink.displayName = "DocsNavLink";
