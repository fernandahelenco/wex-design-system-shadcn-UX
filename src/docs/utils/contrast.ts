/**
 * WCAG Contrast Ratio Utilities
 *
 * Provides functions to compute contrast ratios and determine
 * accessibility ratings for color pairings.
 *
 * WCAG 2.1 Contrast Thresholds (for text):
 * - AAA Normal text: 7.0:1
 * - AA Normal text: 4.5:1
 * - AA Large text: 3.0:1
 *
 * These are SIGNALS, not certifications.
 */

export type ContrastRating = "AAA" | "AA" | "AA-large" | "Fail";

/**
 * WCAG contrast thresholds
 */
export const CONTRAST_THRESHOLDS = {
  AAA_NORMAL: 7.0,
  AA_NORMAL: 4.5,
  AA_LARGE: 3.0,
} as const;

/**
 * Parse an HSL string (from CSS variable) to RGB values
 * Expects format: "210 100% 50%" (hue saturation% lightness%)
 */
export function hslToRgb(hslString: string): { r: number; g: number; b: number } | null {
  // Handle format: "210 100% 50%" or "210, 100%, 50%"
  const parts = hslString
    .replace(/%/g, "")
    .split(/[\s,]+/)
    .map((s) => parseFloat(s.trim()));

  if (parts.length < 3 || parts.some(isNaN)) {
    return null;
  }

  const [h, s, l] = parts;
  const sNorm = s / 100;
  const lNorm = l / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let r1 = 0,
    g1 = 0,
    b1 = 0;

  if (h >= 0 && h < 60) {
    r1 = c;
    g1 = x;
    b1 = 0;
  } else if (h >= 60 && h < 120) {
    r1 = x;
    g1 = c;
    b1 = 0;
  } else if (h >= 120 && h < 180) {
    r1 = 0;
    g1 = c;
    b1 = x;
  } else if (h >= 180 && h < 240) {
    r1 = 0;
    g1 = x;
    b1 = c;
  } else if (h >= 240 && h < 300) {
    r1 = x;
    g1 = 0;
    b1 = c;
  } else if (h >= 300 && h < 360) {
    r1 = c;
    g1 = 0;
    b1 = x;
  }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

/**
 * Parse a color string (hex, rgb, hsl) to RGB values
 */
export function parseColor(color: string): { r: number; g: number; b: number } | null {
  const trimmed = color.trim();

  // Hex format: #RGB, #RRGGBB
  if (trimmed.startsWith("#")) {
    const hex = trimmed.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
      };
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
      };
    }
    return null;
  }

  // RGB format: rgb(r, g, b)
  const rgbMatch = trimmed.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
    };
  }

  // HSL format without function: "210 100% 50%"
  if (/^\d+\s+\d+%\s+\d+%$/.test(trimmed)) {
    return hslToRgb(trimmed);
  }

  // HSL format: hsl(h, s%, l%)
  const hslMatch = trimmed.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/);
  if (hslMatch) {
    return hslToRgb(`${hslMatch[1]} ${hslMatch[2]}% ${hslMatch[3]}%`);
  }

  return null;
}

/**
 * Calculate relative luminance of a color
 * Per WCAG 2.1: https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
export function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const sRGB = [rgb.r / 255, rgb.g / 255, rgb.b / 255];

  const [r, g, b] = sRGB.map((val) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate WCAG contrast ratio between two colors
 * Returns a value between 1 and 21
 */
export function getContrastRatio(
  fg: { r: number; g: number; b: number },
  bg: { r: number; g: number; b: number }
): number {
  const l1 = getRelativeLuminance(fg);
  const l2 = getRelativeLuminance(bg);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get contrast rating based on ratio
 * This is a SIGNAL, not a certification
 */
export function getContrastRating(ratio: number): ContrastRating {
  if (ratio >= CONTRAST_THRESHOLDS.AAA_NORMAL) {
    return "AAA";
  }
  if (ratio >= CONTRAST_THRESHOLDS.AA_NORMAL) {
    return "AA";
  }
  if (ratio >= CONTRAST_THRESHOLDS.AA_LARGE) {
    return "AA-large";
  }
  return "Fail";
}

/**
 * Resolve a CSS variable to its computed value
 * Must be called from a React component or effect (client-side only)
 */
export function resolveColorVariable(varName: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  // Get computed style from root element
  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue(varName).trim();

  return value || null;
}

/**
 * Get contrast data for a foreground/background CSS variable pairing
 */
export interface ContrastData {
  ratio: number;
  rating: ContrastRating;
  fg: string;
  bg: string;
}

export function getContrastData(fgVar: string, bgVar: string): ContrastData | null {
  const fgValue = resolveColorVariable(fgVar);
  const bgValue = resolveColorVariable(bgVar);

  if (!fgValue || !bgValue) {
    return null;
  }

  const fgRgb = hslToRgb(fgValue);
  const bgRgb = hslToRgb(bgValue);

  if (!fgRgb || !bgRgb) {
    return null;
  }

  const ratio = getContrastRatio(fgRgb, bgRgb);
  const rating = getContrastRating(ratio);

  return {
    ratio,
    rating,
    fg: fgValue,
    bg: bgValue,
  };
}

/**
 * Format contrast ratio for display
 */
export function formatContrastRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}

/**
 * Determine if dark text should be used on a given background
 * Based on relative luminance calculation (WCAG standard)
 * 
 * @param bgVar - CSS variable name for the background color
 * @returns true if dark text should be used, false for light/white text
 */
export function shouldUseDarkText(bgVar: string): boolean {
  const bgValue = resolveColorVariable(bgVar);
  if (!bgValue) return false;
  
  const bgRgb = hslToRgb(bgValue);
  if (!bgRgb) return false;
  
  const luminance = getRelativeLuminance(bgRgb);
  return luminance > 0.5; // Light backgrounds need dark text
}

/**
 * Component contrast pairs - defines foreground/background relationships
 * that must meet WCAG AA (4.5:1) contrast ratio
 */
export interface ContrastPair {
  name: string;
  component: string;
  foreground: string;
  background: string;
  /** Maps to PreviewCard title in FilteredLivePreview for per-card indicators */
  previewCard?: string;
}

export const CONTRAST_PAIRS: ContrastPair[] = [
  // ==========================================================================
  // BUTTONS
  // ==========================================================================
  {
    name: "Primary Button Text",
    component: "WexButton (default)",
    foreground: "--primary-foreground",
    background: "--primary",
    previewCard: "Buttons",
  },
  {
    name: "Destructive Button Text",
    component: "WexButton (destructive)",
    foreground: "--destructive-foreground",
    background: "--destructive",
    previewCard: "Buttons",
  },

  // ==========================================================================
  // BADGES
  // ==========================================================================
  {
    name: "Default Badge Text",
    component: "WexBadge (default)",
    foreground: "--primary-foreground",
    background: "--primary",
    previewCard: "Badge",
  },
  {
    name: "Success Badge Text",
    component: "WexBadge (success)",
    foreground: "--success-foreground",
    background: "--success",
    previewCard: "Badge",
  },
  {
    name: "Warning Badge Text",
    component: "WexBadge (warning)",
    foreground: "--warning-foreground",
    background: "--warning",
    previewCard: "Badge",
  },
  {
    name: "Info Badge Text",
    component: "WexBadge (info)",
    foreground: "--info-foreground",
    background: "--info",
    previewCard: "Badge",
  },

  // ==========================================================================
  // PROGRESS
  // ==========================================================================
  {
    name: "Progress Bar on Track",
    component: "WexProgress",
    foreground: "--primary",
    background: "--muted",
    previewCard: "Progress",
  },

  // ==========================================================================
  // SWITCH (graphical object contrast - 3:1 minimum, but we check 4.5:1)
  // ==========================================================================
  {
    name: "Switch Checked State",
    component: "WexSwitch (checked)",
    foreground: "--primary-foreground",
    background: "--primary",
    previewCard: "Switch",
  },

  // ==========================================================================
  // CHECKBOX
  // ==========================================================================
  {
    name: "Checkbox Checked State",
    component: "WexCheckbox (checked)",
    foreground: "--primary-foreground",
    background: "--primary",
    previewCard: "Checkbox",
  },

  // ==========================================================================
  // RADIO GROUP
  // ==========================================================================
  {
    name: "Radio Selected State",
    component: "WexRadioGroup (selected)",
    foreground: "--primary-foreground",
    background: "--primary",
    previewCard: "Radio Group",
  },

  // ==========================================================================
  // SLIDER
  // ==========================================================================
  {
    name: "Slider Track Fill",
    component: "WexSlider",
    foreground: "--primary",
    background: "--muted",
    previewCard: "Slider",
  },

  // ==========================================================================
  // SKELETON
  // ==========================================================================
  {
    name: "Skeleton on Background",
    component: "WexSkeleton",
    foreground: "--muted",
    background: "--background",
    previewCard: "Skeleton",
  },

  // ==========================================================================
  // FOCUS RING
  // ==========================================================================
  {
    name: "Focus Ring Visibility",
    component: "Focus ring on background",
    foreground: "--ring",
    background: "--background",
    previewCard: "Focus Ring",
  },

  // ==========================================================================
  // CALENDAR
  // ==========================================================================
  {
    name: "Calendar Selected Date",
    component: "WexCalendar (selected)",
    foreground: "--primary-foreground",
    background: "--primary",
    previewCard: "Calendar",
  },

  // ==========================================================================
  // ALERTS
  // ==========================================================================
  {
    name: "Destructive Alert Text",
    component: "WexAlert (destructive)",
    foreground: "--destructive",
    background: "--background",
    previewCard: "Alert",
  },
  {
    name: "Success Alert Text",
    component: "WexAlert (success)",
    foreground: "--success",
    background: "--background",
    previewCard: "Alert",
  },
  {
    name: "Warning Alert Text",
    component: "WexAlert (warning)",
    foreground: "--warning",
    background: "--background",
    previewCard: "Alert",
  },
  {
    name: "Info Alert Text",
    component: "WexAlert (info)",
    foreground: "--info",
    background: "--background",
    previewCard: "Alert",
  },

  // ==========================================================================
  // SURFACE TEXT (general - no specific card)
  // ==========================================================================
  {
    name: "Body Text on Background",
    component: "All text content",
    foreground: "--foreground",
    background: "--background",
  },
  {
    name: "Muted Text on Background",
    component: "Labels, descriptions",
    foreground: "--muted-foreground",
    background: "--background",
  },
  {
    name: "Card Title Text",
    component: "WexCard.Title",
    foreground: "--card-foreground",
    background: "--card",
  },

  // ==========================================================================
  // SPINNER
  // ==========================================================================
  {
    name: "Spinner on Background",
    component: "WexSpinner",
    foreground: "--primary",
    background: "--background",
    previewCard: "Spinner",
  },

  // ==========================================================================
  // BUTTON GROUP
  // ==========================================================================
  {
    name: "Button Group Primary",
    component: "WexButtonGroup (primary)",
    foreground: "--primary-foreground",
    background: "--primary",
    previewCard: "Button Group",
  },

  // ==========================================================================
  // PAGINATION
  // ==========================================================================
  {
    name: "Pagination Active Page",
    component: "WexPagination (active)",
    foreground: "--primary-foreground",
    background: "--primary",
    previewCard: "Pagination",
  },

  // ==========================================================================
  // AVATAR
  // ==========================================================================
  {
    name: "Avatar Fallback Text",
    component: "WexAvatar (fallback)",
    foreground: "--muted-foreground",
    background: "--muted",
    previewCard: "Avatar (fallback = bg-muted)",
  },

  // ==========================================================================
  // TEXTAREA
  // ==========================================================================
  {
    name: "Textarea Placeholder",
    component: "WexTextarea",
    foreground: "--muted-foreground",
    background: "--background",
    previewCard: "Textarea",
  },

  // ==========================================================================
  // SELECT
  // ==========================================================================
  {
    name: "Select Placeholder Text",
    component: "WexSelect (trigger)",
    foreground: "--muted-foreground",
    background: "--background",
    previewCard: "Select (trigger = border-input)",
  },

  // ==========================================================================
  // TABS
  // ==========================================================================
  {
    name: "Tabs Active Text",
    component: "WexTabs (active trigger)",
    foreground: "--foreground",
    background: "--background",
    previewCard: "Tabs (bg-muted list)",
  },

  // ==========================================================================
  // TOGGLE
  // ==========================================================================
  {
    name: "Toggle Pressed Text",
    component: "WexToggle (pressed)",
    foreground: "--accent-foreground",
    background: "--accent",
    previewCard: "Toggle (on = bg-accent)",
  },

  // ==========================================================================
  // TOAST PREVIEWS
  // ==========================================================================
  {
    name: "Success Toast Text",
    component: "WexToast/Sonner (success)",
    foreground: "--success-foreground",
    background: "--success",
    previewCard: "Toast Preview",
  },
  {
    name: "Warning Toast Text",
    component: "WexToast/Sonner (warning)",
    foreground: "--warning-foreground",
    background: "--warning",
    previewCard: "Toast Preview",
  },
  {
    name: "Info Toast Text",
    component: "WexToast/Sonner (info)",
    foreground: "--info-foreground",
    background: "--info",
    previewCard: "Toast Preview",
  },

  // ==========================================================================
  // ADDITIONAL COMPONENTS (non-rendered in live preview)
  // ==========================================================================
  
  // Accordion
  {
    name: "Accordion Trigger Text",
    component: "WexAccordion",
    foreground: "--foreground",
    background: "--background",
  },

  // Carousel
  {
    name: "Carousel Navigation on Background",
    component: "WexCarousel",
    foreground: "--foreground",
    background: "--muted",
  },

  // Chart (text labels)
  {
    name: "Chart Axis Labels",
    component: "WexChart",
    foreground: "--muted-foreground",
    background: "--background",
  },

  // Drawer
  {
    name: "Drawer Content Text",
    component: "WexDrawer",
    foreground: "--foreground",
    background: "--background",
  },

  // Empty state
  {
    name: "Empty State Text",
    component: "WexEmpty",
    foreground: "--muted-foreground",
    background: "--background",
  },

  // Hover Card
  {
    name: "Hover Card Text",
    component: "WexHoverCard",
    foreground: "--popover-foreground",
    background: "--popover",
  },

  // Input Group
  {
    name: "Input Group Label",
    component: "WexInputGroup",
    foreground: "--foreground",
    background: "--background",
  },

  // Input OTP
  {
    name: "OTP Input Text",
    component: "WexInputOTP",
    foreground: "--foreground",
    background: "--background",
  },

  // Menubar
  {
    name: "Menubar Item Text",
    component: "WexMenubar",
    foreground: "--foreground",
    background: "--background",
  },

  // Sidebar
  {
    name: "Sidebar Item Text",
    component: "WexSidebar",
    foreground: "--sidebar-foreground",
    background: "--sidebar",
  },

  // Table
  {
    name: "Table Cell Text",
    component: "WexTable",
    foreground: "--foreground",
    background: "--background",
  },

  // Toggle Group
  {
    name: "Toggle Group Pressed Text",
    component: "WexToggleGroup",
    foreground: "--accent-foreground",
    background: "--accent",
  },

  // Tooltip
  {
    name: "Tooltip Text",
    component: "WexTooltip",
    foreground: "--popover-foreground",
    background: "--popover",
  },
];

/**
 * A11y issue for display
 */
export interface A11yIssue {
  pair: ContrastPair;
  ratio: number;
  required: number;
  rating: ContrastRating;
}

/**
 * Check all contrast pairs and return any failures
 * @returns Array of A11yIssue objects for pairs that fail WCAG AA
 */
export function checkAllContrastPairs(): A11yIssue[] {
  const issues: A11yIssue[] = [];
  
  for (const pair of CONTRAST_PAIRS) {
    const data = getContrastData(pair.foreground, pair.background);
    
    if (data && data.rating === "Fail") {
      issues.push({
        pair,
        ratio: data.ratio,
        required: CONTRAST_THRESHOLDS.AA_NORMAL,
        rating: data.rating,
      });
    }
  }
  
  return issues;
}

