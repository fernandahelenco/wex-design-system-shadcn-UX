/**
 * WEX Design Tokens - Tailwind CSS Preset
 * 
 * This preset provides WEX brand colors, typography, spacing, and animations
 * for use with Tailwind CSS. It's designed to work with shadcn/ui (React) 
 * and Spartan UI (Angular).
 * 
 * Usage:
 *   // tailwind.config.js
 *   const wexPreset = require("@wex/design-tokens/tailwind-preset");
 *   module.exports = {
 *     presets: [wexPreset],
 *     content: ["./src/** /*.{js,ts,jsx,tsx,html}"],
 *   };
 * 
 * @see https://tailwindcss.com/docs/presets
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Core backgrounds
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        
        // Brand
        brand: {
          red: "hsl(var(--brand-red) / <alpha-value>)",
        },
        
        // Card
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        
        // Popover
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        
        // Primary (interactive elements)
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          hover: "hsl(var(--primary-hover) / <alpha-value>)",
        },
        
        // Secondary
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
          hover: "hsl(var(--secondary-hover) / <alpha-value>)",
        },
        
        // Muted (subtle backgrounds, disabled states)
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        
        // Accent (hover states, highlights)
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        
        // Destructive (errors, delete actions)
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
          hover: "hsl(var(--destructive-hover) / <alpha-value>)",
        },
        
        // Success
        success: {
          DEFAULT: "hsl(var(--success) / <alpha-value>)",
          foreground: "hsl(var(--success-foreground) / <alpha-value>)",
          hover: "hsl(var(--success-hover) / <alpha-value>)",
        },
        
        // Warning
        warning: {
          DEFAULT: "hsl(var(--warning) / <alpha-value>)",
          foreground: "hsl(var(--warning-foreground) / <alpha-value>)",
          hover: "hsl(var(--warning-hover) / <alpha-value>)",
        },
        
        // Info
        info: {
          DEFAULT: "hsl(var(--info) / <alpha-value>)",
          foreground: "hsl(var(--info-foreground) / <alpha-value>)",
          hover: "hsl(var(--info-hover) / <alpha-value>)",
        },
        
        // Borders & Inputs
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        
        // Sidebar
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-foreground) / <alpha-value>)",
          primary: "hsl(var(--sidebar-primary) / <alpha-value>)",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
          accent: "hsl(var(--sidebar-accent) / <alpha-value>)",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
          border: "hsl(var(--sidebar-border) / <alpha-value>)",
          ring: "hsl(var(--sidebar-ring) / <alpha-value>)",
        },
        
        // Chart colors
        chart: {
          1: "hsl(var(--chart-1) / <alpha-value>)",
          2: "hsl(var(--chart-2) / <alpha-value>)",
          3: "hsl(var(--chart-3) / <alpha-value>)",
          4: "hsl(var(--chart-4) / <alpha-value>)",
          5: "hsl(var(--chart-5) / <alpha-value>)",
        },
      },
      
      // Border radius
      borderRadius: {
        lg: "calc(var(--radius) + 2px)",
        md: "var(--radius)",
        sm: "calc(var(--radius) - 2px)",
      },
      
      // Typography
      fontFamily: {
        sans: ["var(--wex-font-sans)"],
        display: ["var(--wex-font-display)"],
      },
      
      // Accessibility: minimum touch target sizes (44px)
      minHeight: {
        target: "var(--wex-min-target)",
      },
      minWidth: {
        target: "var(--wex-min-target)",
      },
      
      // Animations
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    // Note: Consumer must install tailwindcss-animate separately
    // require("tailwindcss-animate"),
  ],
};

