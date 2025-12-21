/**
 * ThemeBuilderContext
 * 
 * Provides shared state for the Theme Builder across components:
 * - ThemeBuilderNav (left rail)
 * - ThemeBuilderPage (workspace + properties)
 * 
 * This solves the issue where useThemeBuilderState created separate
 * state instances for each component that called it.
 */

import * as React from "react";
import { useNavigate } from "react-router-dom";
import complianceData from "@/docs/registry/compliance.json";
import type { ComplianceResult } from "@/docs/hooks/useA11yCompliance";

// ============================================================
// TYPES
// ============================================================

export type ThemeBuilderSelection = 
  | { type: "global"; category: GlobalCategory }
  | { type: "component"; key: string };

export type GlobalCategory = 
  | "surfaces"
  | "text"
  | "borders"
  | "focus"
  | "radii"
  | "brand";

export interface ThemeBuilderContextValue {
  // Selection (legacy - for component/global category)
  selection: ThemeBuilderSelection;
  setSelection: (selection: ThemeBuilderSelection) => void;
  selectGlobal: (category: GlobalCategory) => void;
  selectComponent: (key: string) => void;
  
  // Selected token (V4 - for palette shade selection)
  selectedToken: string | null;
  setSelectedToken: (token: string | null) => void;
  
  // Edit mode
  editMode: "light" | "dark";
  setEditMode: (mode: "light" | "dark") => void;
  
  // A11y
  issueCounts: { light: number; dark: number };
  
  // Navigation
  exitThemeBuilder: () => void;
}

// ============================================================
// STORAGE KEYS
// ============================================================

const STORAGE_KEY_LAST_PAGE = "wex-theme-builder-last-page";
const STORAGE_KEY_SELECTION = "wex-theme-builder-selection";

// ============================================================
// HELPERS
// ============================================================

function getLastVisitedPage(): string {
  if (typeof window === "undefined") return "/";
  return sessionStorage.getItem(STORAGE_KEY_LAST_PAGE) || "/";
}

function getSavedSelection(): ThemeBuilderSelection | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY_SELECTION);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveSelection(selection: ThemeBuilderSelection): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY_SELECTION, JSON.stringify(selection));
}

function getA11yIssueCounts(): { light: number; dark: number } {
  let light = 0;
  let dark = 0;

  Object.entries(complianceData).forEach(([key, value]) => {
    if (key === "_meta") return;
    const comp = value as ComplianceResult;
    
    const lightStatus = comp.modes?.light?.status ?? comp.status;
    const darkStatus = comp.modes?.dark?.status ?? comp.status;
    
    if (lightStatus === "fail" || lightStatus === "partial") {
      light++;
    }
    if (darkStatus === "fail" || darkStatus === "partial") {
      dark++;
    }
  });

  return { light, dark };
}

/**
 * Get components with a11y issues for the given mode
 */
export function getComponentsWithIssues(mode: "light" | "dark"): string[] {
  const failing: string[] = [];

  Object.entries(complianceData).forEach(([key, value]) => {
    if (key === "_meta") return;
    const comp = value as ComplianceResult;
    const modeStatus = comp.modes?.[mode]?.status ?? comp.status;
    
    if (modeStatus === "fail" || modeStatus === "partial") {
      failing.push(key);
    }
  });

  return failing;
}

// ============================================================
// CONTEXT
// ============================================================

const ThemeBuilderContext = React.createContext<ThemeBuilderContextValue | null>(null);

// ============================================================
// PROVIDER
// ============================================================

interface ThemeBuilderProviderProps {
  children: React.ReactNode;
  /** Optional: set initial last visited page for exit navigation */
  lastVisitedPage?: string;
}

export function ThemeBuilderProvider({ children, lastVisitedPage }: ThemeBuilderProviderProps) {
  const navigate = useNavigate();
  
  // Selection state - persisted to sessionStorage (legacy for component/global)
  const [selection, setSelectionState] = React.useState<ThemeBuilderSelection>(() => {
    const saved = getSavedSelection();
    return saved || { type: "global", category: "surfaces" };
  });
  
  // Selected token (V4 - for direct palette shade selection)
  const [selectedToken, setSelectedToken] = React.useState<string | null>(null);
  
  // Editing mode (light/dark) - also toggles document class
  const [editMode, setEditModeState] = React.useState<"light" | "dark">("light");
  
  // Store original theme to restore on exit
  const originalTheme = React.useRef<"light" | "dark">("light");
  
  // Capture original theme on mount
  React.useEffect(() => {
    originalTheme.current = document.documentElement.classList.contains("dark") 
      ? "dark" 
      : "light";
  }, []);
  
  // Custom setEditMode that also applies dark class to document
  const setEditMode = React.useCallback((mode: "light" | "dark") => {
    setEditModeState(mode);
    if (typeof document !== "undefined") {
      if (mode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);
  
  // Restore original theme when unmounting (exiting Theme Builder)
  React.useEffect(() => {
    return () => {
      if (typeof document !== "undefined") {
        if (originalTheme.current === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };
  }, []);
  
  // A11y issue counts per mode (computed once)
  const issueCounts = React.useMemo(() => getA11yIssueCounts(), []);

  // Save last visited page on mount if provided
  React.useEffect(() => {
    if (lastVisitedPage && typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY_LAST_PAGE, lastVisitedPage);
    }
  }, [lastVisitedPage]);

  // Set selection and persist
  const setSelection = React.useCallback((newSelection: ThemeBuilderSelection) => {
    setSelectionState(newSelection);
    saveSelection(newSelection);
  }, []);

  // Select a global category
  const selectGlobal = React.useCallback((category: GlobalCategory) => {
    setSelection({ type: "global", category });
  }, [setSelection]);

  // Select a component
  const selectComponent = React.useCallback((key: string) => {
    setSelection({ type: "component", key });
  }, [setSelection]);

  // Exit Theme Builder - navigate to last visited page
  const exitThemeBuilder = React.useCallback(() => {
    const lastPage = getLastVisitedPage();
    navigate(lastPage);
  }, [navigate]);

  const value: ThemeBuilderContextValue = {
    selection,
    setSelection,
    selectGlobal,
    selectComponent,
    selectedToken,
    setSelectedToken,
    editMode,
    setEditMode,
    issueCounts,
    exitThemeBuilder,
  };

  return (
    <ThemeBuilderContext.Provider value={value}>
      {children}
    </ThemeBuilderContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

/**
 * Hook to access Theme Builder context.
 * Must be used within a ThemeBuilderProvider.
 */
export function useThemeBuilder(): ThemeBuilderContextValue {
  const context = React.useContext(ThemeBuilderContext);
  
  if (!context) {
    throw new Error("useThemeBuilder must be used within a ThemeBuilderProvider");
  }
  
  return context;
}

