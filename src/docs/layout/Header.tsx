import { Link } from "react-router-dom";
import { ThemeToggle } from "@/docs/components/ThemeToggle";

/**
 * Docs site header with WEX logo and theme toggle
 * Logo switches between red (light mode) and white (dark mode) variants
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-brand-red before:via-brand-red/50 before:to-transparent">
      <div className="flex h-14 items-center justify-between px-6">
        <Link to="/design-system" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          {/* Light mode logo */}
          <img
            src={`${import.meta.env.BASE_URL}WEX_Logo_Red_Vector.svg`}
            alt="WEX"
            className="h-6 dark:hidden"
          />
          {/* Dark mode logo */}
          <img
            src={`${import.meta.env.BASE_URL}WEX_Logo_White_Vector.svg`}
            alt="WEX"
            className="h-6 hidden dark:block"
          />
          <span className="font-display text-sm font-medium text-muted-foreground">
            Design System
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link 
            to="/"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Consumer Experience
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

