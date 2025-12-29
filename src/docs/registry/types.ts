/**
 * Registry types for docs navigation and route generation
 */

export type ComponentStatus = "alpha" | "beta" | "stable";

/**
 * Component categories for sidebar navigation grouping
 */
export type ComponentCategory =
  | "actions"
  | "form-inputs"
  | "form-structure"
  | "layout"
  | "data-display"
  | "feedback"
  | "navigation"
  | "overlays";

/**
 * Category metadata for rendering in sidebar
 */
export const categoryConfig: Record<ComponentCategory, { label: string; order: number }> = {
  "actions": { label: "Actions", order: 1 },
  "form-inputs": { label: "Form Inputs", order: 2 },
  "form-structure": { label: "Form Structure", order: 3 },
  "layout": { label: "Layout", order: 4 },
  "data-display": { label: "Data Display", order: 5 },
  "feedback": { label: "Feedback", order: 6 },
  "navigation": { label: "Navigation", order: 7 },
  "overlays": { label: "Overlays", order: 8 },
};

export interface ComponentRegistryEntry {
  /** Display name in navigation */
  name: string;
  /** URL route path */
  route: string;
  /** Import path for lazy loading (used in routes.tsx) */
  importPath: string;
  /** Short description for tooltips/search */
  description: string;
  /** Maturity status */
  status: ComponentStatus;
  /** Category for sidebar grouping */
  category: ComponentCategory;
  /** Optional tags for filtering/search */
  tags?: string[];
}

export interface FoundationRegistryEntry {
  /** Display name in navigation */
  name: string;
  /** URL route path */
  route: string;
  /** Import path for lazy loading */
  importPath: string;
  /** Short description */
  description: string;
}

