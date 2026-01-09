import * as React from "react";
import { WexButton } from "@/components/wex";
import { toggleTheme, setTheme, type Theme } from "@/docs/utils/theme";

// Optional context for Theme Builder sync
const ThemeToggleContext = React.createContext<{
  onThemeChange?: (theme: Theme) => void;
} | null>(null);

/**
 * Provider for syncing ThemeToggle with Theme Builder
 * Wrap ThemeBuilderPage with this to have header toggle update editMode
 */
export function ThemeToggleSyncProvider({ 
  children, 
  onThemeChange 
}: { 
  children: React.ReactNode; 
  onThemeChange: (theme: Theme) => void;
}) {
  return (
    <ThemeToggleContext.Provider value={{ onThemeChange }}>
      {children}
    </ThemeToggleContext.Provider>
  );
}

/**
 * Hook to set theme and sync with Theme Builder if available
 */
export function useSyncedTheme() {
  const context = React.useContext(ThemeToggleContext);
  
  const setThemeAndSync = React.useCallback((theme: Theme) => {
    setTheme(theme);
    context?.onThemeChange?.(theme);
  }, [context]);
  
  return { setThemeAndSync };
}

/**
 * Dark mode toggle button
 * Uses WexButton ghost variant for consistent styling
 * Syncs with Theme Builder editMode when wrapped in ThemeToggleSyncProvider
 */
export function ThemeToggle() {
  const [currentTheme, setCurrentTheme] = React.useState<Theme>("light");
  const context = React.useContext(ThemeToggleContext);

  React.useEffect(() => {
    // Initialize state from DOM on mount
    const isDark = document.documentElement.classList.contains("dark");
    setCurrentTheme(isDark ? "dark" : "light");
  }, []);

  // Listen for external theme changes (e.g., from Theme Builder)
  React.useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");
          setCurrentTheme(isDark ? "dark" : "light");
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const handleToggle = () => {
    const newTheme = toggleTheme();
    setCurrentTheme(newTheme);
    // Notify Theme Builder if we're in that context
    context?.onThemeChange?.(newTheme);
  };

  return (
    <WexButton
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      aria-label={`Switch to ${currentTheme === "dark" ? "light" : "dark"} mode`}
    >
      {currentTheme === "dark" ? (
        <SunIcon className="h-4 w-4" />
      ) : (
        <MoonIcon className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </WexButton>
  );
}

// Simple inline SVG icons to avoid external dependencies
function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

