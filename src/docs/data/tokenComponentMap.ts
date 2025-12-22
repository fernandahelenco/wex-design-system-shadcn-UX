/**
 * Token Component Map - SINGLE SOURCE OF TRUTH
 * 
 * This file exhaustively documents every WEX design token and the components that use it.
 * Used by the Theme Builder Live Preview to show affected components.
 * 
 * IMPORTANT: This file should be updated whenever:
 * - A new component is added that uses a token
 * - An existing component changes which tokens it uses
 * - A new token is added
 * 
 * Generated from grep analysis of src/components on 2024-12-21
 */


// =============================================================================
// TYPES
// =============================================================================

export type StateRenderability = "easy" | "hard";

export interface ComponentUsage {
  /** Component name, e.g., "WexButton" */
  component: string;
  /** Variant or context, e.g., "default", "checked", "destructive" */
  variant?: string;
  /** State that triggers this usage, e.g., "checked", "focused", "hover" */
  state?: string;
  /** Whether this state can be easily rendered statically */
  renderability: StateRenderability;
  /** The Tailwind classes that apply this token */
  tailwindClasses: string[];
  /** Description for documentation */
  description?: string;
}

export interface TokenComponentMapping {
  /** CSS variable name, e.g., "--wex-primary" */
  token: string;
  /** Human-readable label */
  label: string;
  /** All component usages for this token */
  usages: ComponentUsage[];
}

// =============================================================================
// PRIMARY TOKEN MAPPINGS
// =============================================================================

export const PRIMARY_USAGES: ComponentUsage[] = [
  // BUTTONS
  {
    component: "WexButton",
    variant: "primary",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-primary", "text-primary-foreground"],
    description: "Primary button background and text",
  },
  {
    component: "WexButton",
    variant: "primary",
    state: "disabled",
    renderability: "easy",
    tailwindClasses: ["bg-primary", "opacity-50"],
    description: "Disabled primary button",
  },
  {
    component: "WexButton",
    variant: "primary",
    state: "hover",
    renderability: "hard",
    tailwindClasses: ["hover:bg-primary-hover"],
    description: "Hover uses derived --wex-primary-hover token",
  },
  {
    component: "WexButton",
    variant: "link",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["text-primary"],
    description: "Link-style button uses primary text color",
  },
  
  // BADGE
  {
    component: "WexBadge",
    variant: "default",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-primary", "text-primary-foreground"],
    description: "Default badge background",
  },

  // SWITCH - only checked state uses primary (unchecked uses bg-input, not primary)
  {
    component: "WexSwitch",
    variant: "default",
    state: "checked",
    renderability: "easy",
    tailwindClasses: ["data-[state=checked]:bg-primary"],
    description: "Checked switch background",
  },

  // CHECKBOX
  {
    component: "WexCheckbox",
    variant: "default",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["border-primary"],
    description: "Checkbox border color",
  },
  {
    component: "WexCheckbox",
    variant: "default",
    state: "checked",
    renderability: "easy",
    tailwindClasses: ["data-[state=checked]:bg-primary", "data-[state=checked]:text-primary-foreground"],
    description: "Checked checkbox fill",
  },
  {
    component: "WexCheckbox",
    variant: "default",
    state: "disabled",
    renderability: "easy",
    tailwindClasses: ["disabled:opacity-50"],
    description: "Disabled checkbox",
  },

  // RADIO GROUP
  {
    component: "WexRadioGroup",
    variant: "item",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["border-primary", "text-primary"],
    description: "Radio border and indicator color",
  },

  // SLIDER
  {
    component: "WexSlider",
    variant: "track",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-primary/20"],
    description: "Slider track background (20% opacity)",
  },
  {
    component: "WexSlider",
    variant: "range",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-primary"],
    description: "Slider filled range",
  },
  {
    component: "WexSlider",
    variant: "thumb",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["border-primary"],
    description: "Slider thumb border",
  },

  // PROGRESS
  {
    component: "WexProgress",
    variant: "track",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-primary/20"],
    description: "Progress track background (20% opacity)",
  },
  {
    component: "WexProgress",
    variant: "bar",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-primary"],
    description: "Progress fill bar",
  },

  // SKELETON
  {
    component: "WexSkeleton",
    variant: "default",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-primary/10"],
    description: "Skeleton pulse background (10% opacity)",
  },

  // CALENDAR
  {
    component: "WexCalendar",
    variant: "day",
    state: "selected-single",
    renderability: "easy",
    tailwindClasses: ["data-[selected-single=true]:bg-primary", "data-[selected-single=true]:text-primary-foreground"],
    description: "Selected date in single mode",
  },
  {
    component: "WexCalendar",
    variant: "day",
    state: "range-start",
    renderability: "easy",
    tailwindClasses: ["data-[range-start=true]:bg-primary", "data-[range-start=true]:text-primary-foreground"],
    description: "Range start date",
  },
  {
    component: "WexCalendar",
    variant: "day",
    state: "range-end",
    renderability: "easy",
    tailwindClasses: ["data-[range-end=true]:bg-primary", "data-[range-end=true]:text-primary-foreground"],
    description: "Range end date",
  },

  // FIELD (form field wrapper)
  {
    component: "Field",
    variant: "default",
    state: "checked",
    renderability: "easy",
    tailwindClasses: ["has-data-[state=checked]:bg-primary/5", "has-data-[state=checked]:border-primary"],
    description: "Field container when child is checked",
  },

  // LINKS (in Item, Empty components)
  {
    component: "Item",
    variant: "link",
    state: "hover",
    renderability: "hard",
    tailwindClasses: ["[&>a:hover]:text-primary"],
    description: "Link hover in Item component",
  },
  {
    component: "Empty",
    variant: "link",
    state: "hover",
    renderability: "hard",
    tailwindClasses: ["[&>a:hover]:text-primary"],
    description: "Link hover in Empty component",
  },

  // SONNER (toast)
  {
    component: "Sonner",
    variant: "action",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["group-[.toast]:bg-primary", "group-[.toast]:text-primary-foreground"],
    description: "Toast action button",
  },

  // SPINNER
  {
    component: "WexSpinner",
    variant: "default",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["text-primary"],
    description: "Loading spinner (inherits primary color)",
  },

  // BUTTON GROUP
  {
    component: "WexButtonGroup",
    variant: "primary",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-primary", "text-primary-foreground"],
    description: "Grouped primary buttons",
  },

  // PAGINATION
  {
    component: "WexPagination",
    variant: "link",
    state: "active",
    renderability: "easy",
    tailwindClasses: ["bg-primary", "text-primary-foreground"],
    description: "Active pagination page",
  },

  // DATE PICKER (uses Calendar which uses primary)
  {
    component: "WexDatePicker",
    variant: "calendar",
    state: "selected",
    renderability: "hard",
    tailwindClasses: ["bg-primary", "text-primary-foreground"],
    description: "Selected date in date picker (via Calendar)",
  },

  // DATA TABLE
  {
    component: "WexDataTable",
    variant: "sort-icon",
    state: "active",
    renderability: "hard",
    tailwindClasses: ["text-primary"],
    description: "Active sort column indicator",
  },

  // DIALOG (action buttons)
  {
    component: "WexDialog",
    variant: "action",
    state: "default",
    renderability: "hard",
    tailwindClasses: ["bg-primary", "text-primary-foreground"],
    description: "Dialog primary action button",
  },

  // ALERT DIALOG (confirm button)
  {
    component: "WexAlertDialog",
    variant: "action",
    state: "default",
    renderability: "hard",
    tailwindClasses: ["bg-primary", "text-primary-foreground"],
    description: "Alert dialog confirm button",
  },

  // SHEET (close button uses primary on hover)
  {
    component: "WexSheet",
    variant: "close",
    state: "hover",
    renderability: "hard",
    tailwindClasses: ["hover:text-primary"],
    description: "Sheet close button hover",
  },

  // COMMAND (selected item)
  {
    component: "WexCommand",
    variant: "item",
    state: "selected",
    renderability: "hard",
    tailwindClasses: ["aria-selected:bg-primary/10", "aria-selected:text-primary"],
    description: "Selected command item",
  },

  // COMBOBOX (selected item)
  {
    component: "WexCombobox",
    variant: "item",
    state: "selected",
    renderability: "hard",
    tailwindClasses: ["bg-primary/10", "text-primary"],
    description: "Selected combobox item",
  },

  // SELECT (selected indicator)
  {
    component: "WexSelect",
    variant: "item",
    state: "selected",
    renderability: "hard",
    tailwindClasses: ["text-primary"],
    description: "Selected item check indicator",
  },

  // NAVIGATION MENU (active link)
  {
    component: "WexNavigationMenu",
    variant: "link",
    state: "active",
    renderability: "hard",
    tailwindClasses: ["text-primary"],
    description: "Active navigation link",
  },

  // BREADCRUMB (current page or link hover)
  {
    component: "WexBreadcrumb",
    variant: "link",
    state: "hover",
    renderability: "hard",
    tailwindClasses: ["hover:text-primary"],
    description: "Breadcrumb link hover",
  },

  // ACCORDION (trigger hover)
  {
    component: "WexAccordion",
    variant: "trigger",
    state: "hover",
    renderability: "hard",
    tailwindClasses: ["hover:underline"],
    description: "Accordion trigger hover state",
  },

  // CAROUSEL (active navigation dot)
  {
    component: "WexCarousel",
    variant: "dot",
    state: "active",
    renderability: "hard",
    tailwindClasses: ["bg-primary"],
    description: "Active carousel navigation dot",
  },

  // CHART (primary data series)
  {
    component: "WexChart",
    variant: "series",
    state: "default",
    renderability: "hard",
    tailwindClasses: ["fill-primary", "stroke-primary"],
    description: "Primary chart data series color",
  },

  // DRAWER (action buttons)
  {
    component: "WexDrawer",
    variant: "action",
    state: "default",
    renderability: "hard",
    tailwindClasses: ["bg-primary", "text-primary-foreground"],
    description: "Drawer primary action button",
  },

  // EMPTY (action link)
  {
    component: "WexEmpty",
    variant: "action",
    state: "default",
    renderability: "hard",
    tailwindClasses: ["text-primary"],
    description: "Empty state action link",
  },

  // HOVER CARD (link text)
  {
    component: "WexHoverCard",
    variant: "link",
    state: "default",
    renderability: "hard",
    tailwindClasses: ["text-primary"],
    description: "Hover card link text",
  },

  // MENUBAR (active item)
  {
    component: "WexMenubar",
    variant: "item",
    state: "active",
    renderability: "hard",
    tailwindClasses: ["bg-accent", "text-accent-foreground"],
    description: "Active menubar item",
  },

  // SIDEBAR (active navigation)
  {
    component: "WexSidebar",
    variant: "nav-item",
    state: "active",
    renderability: "hard",
    tailwindClasses: ["bg-primary/10", "text-primary"],
    description: "Active sidebar navigation item",
  },

  // TABLE (sort headers)
  {
    component: "WexTable",
    variant: "header",
    state: "sortable",
    renderability: "hard",
    tailwindClasses: ["text-primary"],
    description: "Sortable table header indicator",
  },

  // TOGGLE GROUP (pressed state)
  {
    component: "WexToggleGroup",
    variant: "item",
    state: "pressed",
    renderability: "hard",
    tailwindClasses: ["bg-primary", "text-primary-foreground"],
    description: "Pressed toggle group item",
  },

  // TOOLTIP (link text)
  {
    component: "WexTooltip",
    variant: "content",
    state: "default",
    renderability: "hard",
    tailwindClasses: ["bg-popover", "text-popover-foreground"],
    description: "Tooltip content",
  },

  // INPUT OTP (focus ring)
  {
    component: "WexInputOTP",
    variant: "slot",
    state: "focus",
    renderability: "hard",
    tailwindClasses: ["ring-primary"],
    description: "Focused OTP slot ring",
  },

  // INPUT GROUP (focus state)
  {
    component: "WexInputGroup",
    variant: "default",
    state: "focus",
    renderability: "hard",
    tailwindClasses: ["ring-ring"],
    description: "Focused input group ring",
  },
];

// =============================================================================
// DESTRUCTIVE TOKEN MAPPINGS
// =============================================================================

export const DESTRUCTIVE_USAGES: ComponentUsage[] = [
  {
    component: "WexButton",
    variant: "destructive",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-destructive", "text-destructive-foreground"],
    description: "Destructive button",
  },
  {
    component: "WexButton",
    variant: "destructive",
    state: "disabled",
    renderability: "easy",
    tailwindClasses: ["bg-destructive", "opacity-50"],
    description: "Disabled destructive button",
  },
  {
    component: "WexBadge",
    variant: "destructive",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-destructive", "text-destructive-foreground"],
    description: "Destructive badge",
  },
  {
    component: "WexAlert",
    variant: "destructive",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["border-destructive/50", "text-destructive", "[&>svg]:text-destructive"],
    description: "Destructive alert",
  },
  {
    component: "Form",
    variant: "error",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["text-destructive"],
    description: "Form error messages",
  },
  {
    component: "Field",
    variant: "default",
    state: "invalid",
    renderability: "easy",
    tailwindClasses: ["data-[invalid=true]:text-destructive"],
    description: "Invalid field text",
  },
  {
    component: "InputGroup",
    variant: "default",
    state: "invalid",
    renderability: "easy",
    tailwindClasses: ["has-[[aria-invalid=true]]:ring-destructive/20", "has-[[aria-invalid=true]]:border-destructive"],
    description: "Invalid input group styling",
  },
  {
    component: "Sonner",
    variant: "error",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["group-[.toaster]:bg-destructive", "group-[.toaster]:text-destructive-foreground"],
    description: "Error toast",
  },
];

// =============================================================================
// SUCCESS TOKEN MAPPINGS
// =============================================================================

export const SUCCESS_USAGES: ComponentUsage[] = [
  {
    component: "WexBadge",
    variant: "success",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-success", "text-success-foreground"],
    description: "Success badge",
  },
  {
    component: "WexAlert",
    variant: "success",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["border-success/50", "bg-success/10", "text-success"],
    description: "Success alert",
  },
  {
    component: "Sonner",
    variant: "success",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-success", "text-success-foreground"],
    description: "Success toast",
  },
];

// =============================================================================
// WARNING TOKEN MAPPINGS
// =============================================================================

export const WARNING_USAGES: ComponentUsage[] = [
  {
    component: "WexBadge",
    variant: "warning",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-warning", "text-warning-foreground"],
    description: "Warning badge",
  },
  {
    component: "WexAlert",
    variant: "warning",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["border-warning/50", "bg-warning/10", "text-warning-foreground"],
    description: "Warning alert (uses warning-foreground for dark text on amber)",
  },
  {
    component: "Sonner",
    variant: "warning",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-warning", "text-warning-foreground"],
    description: "Warning toast",
  },
];

// =============================================================================
// INFO TOKEN MAPPINGS
// =============================================================================

export const INFO_USAGES: ComponentUsage[] = [
  {
    component: "WexBadge",
    variant: "info",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-info", "text-info-foreground"],
    description: "Info badge",
  },
  {
    component: "WexAlert",
    variant: "info",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["border-info/50", "bg-info/10", "text-info"],
    description: "Info alert",
  },
  {
    component: "Sonner",
    variant: "info",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-info", "text-info-foreground"],
    description: "Info toast",
  },
];

// =============================================================================
// SURFACE TOKEN MAPPINGS (bg-background, bg-muted, bg-accent)
// =============================================================================

export const SURFACE_BACKGROUND_USAGES: ComponentUsage[] = [
  {
    component: "WexCard",
    variant: "default",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-background"],
    description: "Card background",
  },
  {
    component: "WexDialog",
    variant: "content",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-background"],
    description: "Dialog content background",
  },
  {
    component: "WexSheet",
    variant: "content",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-background"],
    description: "Sheet content background",
  },
  {
    component: "WexPopover",
    variant: "content",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-popover"],
    description: "Popover background (maps to background)",
  },
  {
    component: "Sidebar",
    variant: "content",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-background"],
    description: "Sidebar content background",
  },
  {
    component: "NavigationMenu",
    variant: "trigger",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-background"],
    description: "Navigation menu trigger",
  },
  {
    component: "Menubar",
    variant: "default",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-background"],
    description: "Menubar background",
  },
  {
    component: "Drawer",
    variant: "content",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-background"],
    description: "Drawer content background",
  },

  // ALERT DIALOG
  {
    component: "WexAlertDialog",
    variant: "content",
    state: "default",
    renderability: "hard",
    tailwindClasses: ["bg-background"],
    description: "Alert dialog content background",
  },

  // TOOLTIP
  {
    component: "WexTooltip",
    variant: "content",
    state: "default",
    renderability: "hard",
    tailwindClasses: ["bg-popover"],
    description: "Tooltip background",
  },

  // HOVER CARD
  {
    component: "WexHoverCard",
    variant: "content",
    state: "default",
    renderability: "hard",
    tailwindClasses: ["bg-popover"],
    description: "Hover card background",
  },

  // CONTEXT MENU
  {
    component: "WexContextMenu",
    variant: "content",
    state: "default",
    renderability: "hard",
    tailwindClasses: ["bg-popover"],
    description: "Context menu background",
  },

  // DROPDOWN MENU
  {
    component: "WexDropdownMenu",
    variant: "content",
    state: "default",
    renderability: "hard",
    tailwindClasses: ["bg-popover"],
    description: "Dropdown menu background",
  },

  // COMMAND
  {
    component: "WexCommand",
    variant: "dialog",
    state: "default",
    renderability: "hard",
    tailwindClasses: ["bg-popover"],
    description: "Command palette background",
  },
];

export const SURFACE_MUTED_USAGES: ComponentUsage[] = [
  {
    component: "WexTabs",
    variant: "list",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-muted", "text-muted-foreground"],
    description: "Tabs list container background",
  },
  {
    component: "Table",
    variant: "footer",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-muted/50"],
    description: "Table footer background",
  },
  {
    component: "Table",
    variant: "row",
    state: "hover",
    renderability: "hard",
    tailwindClasses: ["hover:bg-muted/50"],
    description: "Table row hover",
  },
  {
    component: "Toggle",
    variant: "default",
    state: "hover",
    renderability: "hard",
    tailwindClasses: ["hover:bg-muted", "hover:text-muted-foreground"],
    description: "Toggle hover state",
  },
  {
    component: "Select",
    variant: "separator",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-muted"],
    description: "Select separator",
  },
  {
    component: "DropdownMenu",
    variant: "separator",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-muted"],
    description: "Dropdown separator",
  },
  {
    component: "ContextMenu",
    variant: "separator",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-muted"],
    description: "Context menu separator",
  },
  {
    component: "Drawer",
    variant: "handle",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-muted"],
    description: "Drawer drag handle",
  },
  {
    component: "Kbd",
    variant: "default",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-muted", "text-muted-foreground"],
    description: "Keyboard shortcut badge",
  },
  {
    component: "Item",
    variant: "muted",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-muted/50"],
    description: "Muted item variant",
  },
  {
    component: "Item",
    variant: "icon",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-muted"],
    description: "Item icon container",
  },
  {
    component: "Empty",
    variant: "icon",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-muted"],
    description: "Empty state icon container",
  },

  // AVATAR (fallback background)
  {
    component: "WexAvatar",
    variant: "fallback",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-muted"],
    description: "Avatar fallback background",
  },

  // ACCORDION (trigger hover)
  {
    component: "WexAccordion",
    variant: "trigger",
    state: "hover",
    renderability: "hard",
    tailwindClasses: ["hover:bg-muted"],
    description: "Accordion trigger hover state",
  },

  // DATA TABLE (row hover)
  {
    component: "WexDataTable",
    variant: "row",
    state: "hover",
    renderability: "hard",
    tailwindClasses: ["hover:bg-muted/50"],
    description: "Table row hover background",
  },

  // PAGINATION (ellipsis and non-active items)
  {
    component: "WexPagination",
    variant: "ellipsis",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["text-muted-foreground"],
    description: "Pagination ellipsis",
  },

  // CAROUSEL (navigation buttons)
  {
    component: "WexCarousel",
    variant: "nav-button",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-muted/50"],
    description: "Carousel navigation buttons",
  },
];

export const SURFACE_ACCENT_USAGES: ComponentUsage[] = [
  {
    component: "WexButton",
    variant: "ghost",
    state: "hover",
    renderability: "hard",
    tailwindClasses: ["hover:bg-accent", "hover:text-accent-foreground"],
    description: "Ghost button hover",
  },
  {
    component: "WexButton",
    variant: "outline",
    state: "hover",
    renderability: "hard",
    tailwindClasses: ["hover:bg-accent", "hover:text-accent-foreground"],
    description: "Outline button hover",
  },
  {
    component: "WexCalendar",
    variant: "day",
    state: "range-middle",
    renderability: "easy",
    tailwindClasses: ["data-[range-middle=true]:bg-accent", "data-[range-middle=true]:text-accent-foreground"],
    description: "Calendar date range middle dates",
  },
  {
    component: "Toggle",
    variant: "default",
    state: "on",
    renderability: "easy",
    tailwindClasses: ["data-[state=on]:bg-accent", "data-[state=on]:text-accent-foreground"],
    description: "Toggle pressed/on state",
  },
  {
    component: "Toggle",
    variant: "outline",
    state: "hover",
    renderability: "hard",
    tailwindClasses: ["hover:bg-accent", "hover:text-accent-foreground"],
    description: "Outline toggle hover",
  },
  {
    component: "Select",
    variant: "item",
    state: "focus",
    renderability: "hard",
    tailwindClasses: ["focus:bg-accent", "focus:text-accent-foreground"],
    description: "Select item focus",
  },
  {
    component: "DropdownMenu",
    variant: "item",
    state: "focus",
    renderability: "hard",
    tailwindClasses: ["focus:bg-accent", "focus:text-accent-foreground"],
    description: "Dropdown item focus",
  },
  {
    component: "ContextMenu",
    variant: "item",
    state: "focus",
    renderability: "hard",
    tailwindClasses: ["focus:bg-accent", "focus:text-accent-foreground"],
    description: "Context menu item focus",
  },
  {
    component: "Menubar",
    variant: "item",
    state: "focus",
    renderability: "hard",
    tailwindClasses: ["focus:bg-accent", "focus:text-accent-foreground"],
    description: "Menubar item focus",
  },
  {
    component: "Menubar",
    variant: "trigger",
    state: "open",
    renderability: "easy",
    tailwindClasses: ["data-[state=open]:bg-accent", "data-[state=open]:text-accent-foreground"],
    description: "Open menubar trigger",
  },
  {
    component: "NavigationMenu",
    variant: "trigger",
    state: "hover",
    renderability: "hard",
    tailwindClasses: ["hover:bg-accent", "hover:text-accent-foreground"],
    description: "Navigation menu hover",
  },
  {
    component: "NavigationMenu",
    variant: "trigger",
    state: "open",
    renderability: "easy",
    tailwindClasses: ["data-[state=open]:bg-accent/50"],
    description: "Open navigation menu trigger",
  },
  {
    component: "Dialog",
    variant: "close",
    state: "open",
    renderability: "easy",
    tailwindClasses: ["data-[state=open]:bg-accent", "data-[state=open]:text-muted-foreground"],
    description: "Dialog close button when open",
  },
  {
    component: "Item",
    variant: "link",
    state: "hover",
    renderability: "hard",
    tailwindClasses: ["[a]:hover:bg-accent/50"],
    description: "Item link hover background",
  },
];

// =============================================================================
// FOCUS RING TOKEN MAPPINGS
// =============================================================================

export const FOCUS_RING_USAGES: ComponentUsage[] = [
  {
    component: "WexButton",
    variant: "all",
    state: "focus",
    renderability: "hard",
    tailwindClasses: ["focus-visible:ring-ring"],
    description: "Button focus ring",
  },
  {
    component: "WexBadge",
    variant: "all",
    state: "focus",
    renderability: "hard",
    tailwindClasses: ["focus:ring-ring"],
    description: "Badge focus ring",
  },
  {
    component: "WexCheckbox",
    variant: "default",
    state: "focus",
    renderability: "hard",
    tailwindClasses: ["focus-visible:ring-ring"],
    description: "Checkbox focus ring",
  },
  {
    component: "WexRadioGroup",
    variant: "item",
    state: "focus",
    renderability: "hard",
    tailwindClasses: ["focus-visible:ring-ring"],
    description: "Radio focus ring",
  },
  {
    component: "WexSwitch",
    variant: "default",
    state: "focus",
    renderability: "hard",
    tailwindClasses: ["focus-visible:ring-ring"],
    description: "Switch focus ring",
  },
  {
    component: "WexSlider",
    variant: "thumb",
    state: "focus",
    renderability: "hard",
    tailwindClasses: ["focus-visible:ring-ring"],
    description: "Slider thumb focus ring",
  },
  {
    component: "WexInput",
    variant: "default",
    state: "focus",
    renderability: "hard",
    tailwindClasses: ["focus-visible:ring-ring"],
    description: "Input focus ring",
  },
  {
    component: "WexTextarea",
    variant: "default",
    state: "focus",
    renderability: "hard",
    tailwindClasses: ["focus-visible:ring-ring"],
    description: "Textarea focus ring",
  },
  {
    component: "WexSelect",
    variant: "trigger",
    state: "focus",
    renderability: "hard",
    tailwindClasses: ["focus:ring-ring"],
    description: "Select trigger focus ring",
  },
  {
    component: "WexTabs",
    variant: "trigger",
    state: "focus",
    renderability: "hard",
    tailwindClasses: ["focus-visible:ring-ring"],
    description: "Tab trigger focus ring",
  },
  {
    component: "WexCalendar",
    variant: "day",
    state: "focus",
    renderability: "hard",
    tailwindClasses: ["group-data-[focused=true]/day:ring-ring/50", "group-data-[focused=true]/day:border-ring"],
    description: "Calendar day focus ring",
  },
  {
    component: "Dialog",
    variant: "close",
    state: "focus",
    renderability: "hard",
    tailwindClasses: ["focus:ring-ring"],
    description: "Dialog close button focus ring",
  },
  {
    component: "Sheet",
    variant: "close",
    state: "focus",
    renderability: "hard",
    tailwindClasses: ["focus:ring-ring"],
    description: "Sheet close button focus ring",
  },
  {
    component: "Toggle",
    variant: "default",
    state: "focus",
    renderability: "hard",
    tailwindClasses: ["focus-visible:ring-ring"],
    description: "Toggle focus ring",
  },
  {
    component: "Resizable",
    variant: "handle",
    state: "focus",
    renderability: "hard",
    tailwindClasses: ["focus-visible:ring-ring"],
    description: "Resizable handle focus ring",
  },
  {
    component: "Item",
    variant: "default",
    state: "focus",
    renderability: "hard",
    tailwindClasses: ["focus-visible:ring-ring/50", "focus-visible:border-ring"],
    description: "Item focus ring",
  },
  {
    component: "InputOTP",
    variant: "slot",
    state: "active",
    renderability: "easy",
    tailwindClasses: ["ring-ring"],
    description: "OTP slot when active",
  },
];

// =============================================================================
// TEXT TOKEN MAPPINGS
// =============================================================================

export const TEXT_FOREGROUND_USAGES: ComponentUsage[] = [
  {
    component: "All",
    variant: "default",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["text-foreground"],
    description: "Primary text color used throughout",
  },
  {
    component: "WexAlert",
    variant: "default",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["text-foreground"],
    description: "Default alert text",
  },
  {
    component: "Sonner",
    variant: "default",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["group-[.toaster]:text-foreground"],
    description: "Default toast text",
  },
  {
    component: "Sonner",
    variant: "action",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["group-[.toast]:text-foreground"],
    description: "Toast cancel button text",
  },
  {
    component: "WexTabs",
    variant: "trigger",
    state: "active",
    renderability: "easy",
    tailwindClasses: ["data-[state=active]:text-foreground"],
    description: "Active tab text",
  },
  {
    component: "Empty",
    variant: "icon",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["text-foreground"],
    description: "Empty state icon color",
  },
  {
    component: "Input",
    variant: "file",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["file:text-foreground"],
    description: "File input text",
  },
];

export const TEXT_MUTED_USAGES: ComponentUsage[] = [
  {
    component: "WexCard",
    variant: "description",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["text-muted-foreground"],
    description: "Card description text",
  },
  {
    component: "WexInput",
    variant: "placeholder",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["placeholder:text-muted-foreground"],
    description: "Input placeholder",
  },
  {
    component: "WexTextarea",
    variant: "placeholder",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["placeholder:text-muted-foreground"],
    description: "Textarea placeholder",
  },
  {
    component: "WexSelect",
    variant: "placeholder",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["data-[placeholder]:text-muted-foreground"],
    description: "Select placeholder",
  },
  {
    component: "WexTabs",
    variant: "list",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["text-muted-foreground"],
    description: "Inactive tabs text",
  },
  {
    component: "Toggle",
    variant: "default",
    state: "hover",
    renderability: "hard",
    tailwindClasses: ["hover:text-muted-foreground"],
    description: "Toggle hover text",
  },
  {
    component: "Dialog",
    variant: "close",
    state: "open",
    renderability: "easy",
    tailwindClasses: ["data-[state=open]:text-muted-foreground"],
    description: "Dialog close button text when open",
  },
  {
    component: "Empty",
    variant: "description",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["text-muted-foreground"],
    description: "Empty state description",
  },
  {
    component: "Kbd",
    variant: "default",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["text-muted-foreground"],
    description: "Keyboard shortcut text",
  },
];

// =============================================================================
// BORDER TOKEN MAPPINGS
// =============================================================================

export const BORDER_USAGES: ComponentUsage[] = [
  {
    component: "WexCard",
    variant: "default",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["border"],
    description: "Card border (uses border-border)",
  },
  {
    component: "WexSeparator",
    variant: "default",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-border"],
    description: "Separator line",
  },
  {
    component: "WexTable",
    variant: "row",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["border-b"],
    description: "Table row border",
  },
  {
    component: "Sonner",
    variant: "default",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["group-[.toaster]:border-border"],
    description: "Toast border",
  },
  {
    component: "Resizable",
    variant: "handle",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["bg-border"],
    description: "Resizable handle",
  },
];

// =============================================================================
// INPUT BORDER TOKEN MAPPINGS (--wex-input-border → border-input)
// =============================================================================

export const INPUT_BORDER_USAGES: ComponentUsage[] = [
  {
    component: "WexInput",
    variant: "default",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["border-input"],
    description: "Input field border",
  },
  {
    component: "WexInput",
    variant: "default",
    state: "disabled",
    renderability: "easy",
    tailwindClasses: ["border-input", "opacity-50"],
    description: "Disabled input border",
  },
  {
    component: "WexInput",
    variant: "default",
    state: "focus",
    renderability: "hard",
    tailwindClasses: ["border-input", "ring-ring"],
    description: "Input border visible with focus ring",
  },
  {
    component: "Textarea",
    variant: "default",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["border-input"],
    description: "Textarea border",
  },
  {
    component: "WexSelect",
    variant: "trigger",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["border-input"],
    description: "Select trigger border",
  },
  {
    component: "WexButton",
    variant: "outline",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["border-input"],
    description: "Outline button border",
  },
  {
    component: "WexButton",
    variant: "outline",
    state: "disabled",
    renderability: "easy",
    tailwindClasses: ["border-input", "opacity-50"],
    description: "Disabled outline button border",
  },
  {
    component: "Toggle",
    variant: "outline",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["border-input"],
    description: "Outline toggle border",
  },
  {
    component: "InputOTP",
    variant: "slot",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["border-input"],
    description: "OTP input slot border",
  },
  {
    component: "Calendar",
    variant: "dropdown",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["border-input"],
    description: "Calendar dropdown border",
  },
  {
    component: "InputGroup",
    variant: "default",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["border-input"],
    description: "Input group container border",
  },

  // TEXTAREA (multi-line input)
  {
    component: "WexTextarea",
    variant: "default",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["border-input"],
    description: "Textarea border",
  },

  // DATE PICKER (input variant)
  {
    component: "WexDatePicker",
    variant: "input",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["border-input"],
    description: "Date picker input border",
  },

  // DATA TABLE (pagination input)
  {
    component: "WexDataTable",
    variant: "pagination-input",
    state: "default",
    renderability: "easy",
    tailwindClasses: ["border-input"],
    description: "Data table rows per page input",
  },
];

// =============================================================================
// MASTER TOKEN COMPONENT MAP
// =============================================================================

export const TOKEN_COMPONENT_MAP: TokenComponentMapping[] = [
  // Intent tokens
  {
    token: "--wex-primary",
    label: "Primary",
    usages: PRIMARY_USAGES,
  },
  {
    token: "--wex-destructive",
    label: "Destructive",
    usages: DESTRUCTIVE_USAGES,
  },
  {
    token: "--wex-success",
    label: "Success",
    usages: SUCCESS_USAGES,
  },
  {
    token: "--wex-warning",
    label: "Warning",
    usages: WARNING_USAGES,
  },
  {
    token: "--wex-info",
    label: "Info",
    usages: INFO_USAGES,
  },

  // Surface tokens
  {
    token: "--wex-content-bg",
    label: "Content Background",
    usages: SURFACE_BACKGROUND_USAGES,
  },
  {
    token: "--wex-surface-subtle",
    label: "Surface Subtle (Muted/Accent)",
    usages: [...SURFACE_MUTED_USAGES, ...SURFACE_ACCENT_USAGES],
  },

  // Text tokens
  {
    token: "--wex-text",
    label: "Text",
    usages: TEXT_FOREGROUND_USAGES,
  },
  {
    token: "--wex-text-muted",
    label: "Text Muted",
    usages: TEXT_MUTED_USAGES,
  },

  // Focus token
  {
    token: "--wex-focus-ring-color",
    label: "Focus Ring",
    usages: FOCUS_RING_USAGES,
  },

  // Border tokens
  {
    token: "--wex-content-border",
    label: "Content Border",
    usages: BORDER_USAGES,
  },
  {
    token: "--wex-input-border",
    label: "Input Border",
    usages: INPUT_BORDER_USAGES,
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get all usages for a specific token
 */
export function getUsagesForToken(tokenName: string): ComponentUsage[] {
  const mapping = TOKEN_COMPONENT_MAP.find(m => m.token === tokenName);
  return mapping?.usages || [];
}

/**
 * Get only the "easy" (renderable) usages for a token
 */
export function getEasyUsagesForToken(tokenName: string): ComponentUsage[] {
  return getUsagesForToken(tokenName).filter(u => u.renderability === "easy");
}

/**
 * Get only the "hard" (need swatch) usages for a token
 */
export function getHardUsagesForToken(tokenName: string): ComponentUsage[] {
  return getUsagesForToken(tokenName).filter(u => u.renderability === "hard");
}

/**
 * Get unique components affected by a token
 */
export function getComponentsForToken(tokenName: string): string[] {
  const usages = getUsagesForToken(tokenName);
  return [...new Set(usages.map(u => u.component))];
}

/**
 * Check if a token has any "hard to show" usages
 */
export function hasHardUsages(tokenName: string): boolean {
  return getHardUsagesForToken(tokenName).length > 0;
}

