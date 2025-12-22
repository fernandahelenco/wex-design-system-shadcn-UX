# @wex/design-tokens

WEX Design System tokens for React and Angular applications.

This package provides CSS variables and a Tailwind CSS preset that work with [shadcn/ui](https://ui.shadcn.com/) (React) and [Spartan UI](https://www.spartan.ng/) (Angular).

## Installation

```bash
npm install @wex/design-tokens
```

## Quick Start

### 1. Import CSS Files

Add to your global stylesheet (before Tailwind directives):

```css
/* styles/globals.css or src/styles.scss */
@import "@wex/design-tokens/css/tokens";
@import "@wex/design-tokens/css/shadcn-bridge";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 2. Configure Tailwind

Add the WEX preset to your Tailwind configuration:

```javascript
// tailwind.config.js
const wexPreset = require("@wex/design-tokens/tailwind-preset");

module.exports = {
  presets: [wexPreset],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}",
    // Include node_modules for shadcn/ui or Spartan components
    "./node_modules/@shadcn/**/*.{js,ts,jsx,tsx}",
  ],
};
```

### 3. Install Required Dependencies

The preset uses `tailwindcss-animate` for animations:

```bash
npm install -D tailwindcss-animate
```

Then add it to your Tailwind plugins:

```javascript
// tailwind.config.js
module.exports = {
  presets: [wexPreset],
  plugins: [require("tailwindcss-animate")],
  // ...
};
```

### 4. Done!

You can now use WEX design tokens in your components:

```jsx
<button className="bg-primary text-primary-foreground hover:bg-primary-hover">
  Click me
</button>
```

---

## What's Included

### CSS Variables (`tokens.css`)

All WEX design tokens as CSS custom properties:

| Category | Examples |
|----------|----------|
| Colors | `--wex-primary`, `--wex-destructive`, `--wex-success` |
| Surfaces | `--wex-content-bg`, `--wex-surface-subtle` |
| Text | `--wex-text`, `--wex-text-muted` |
| Typography | `--wex-font-sans`, `--wex-font-display` |
| Accessibility | `--wex-min-target` (44px touch target) |
| Palette ramps | `--wex-palette-blue-500`, etc. |

### Semantic Bridge (`shadcn-bridge.css`)

Maps WEX tokens to shadcn/Spartan variable names:

| shadcn Variable | WEX Token |
|-----------------|-----------|
| `--primary` | `--wex-primary` |
| `--destructive` | `--wex-destructive` |
| `--background` | `--wex-content-bg` |
| `--muted` | `--wex-surface-subtle` |
| ... | ... |

### Tailwind Preset (`tailwind-preset.js`)

Pre-configured Tailwind theme with:

- All semantic color utilities (`bg-primary`, `text-destructive`, etc.)
- Border radius variants
- Font families
- Accessibility utilities (`min-h-target`, `min-w-target`)
- Radix UI animations

---

## Dark Mode

Dark mode is included automatically. Add the `dark` class to your root element:

```html
<html class="dark">
  <!-- Your app -->
</html>
```

Or use a theme provider like `next-themes`:

```jsx
import { ThemeProvider } from "next-themes";

<ThemeProvider attribute="class">
  <App />
</ThemeProvider>
```

---

## Available Colors

### Intent Colors

| Color | Usage | Tailwind Class |
|-------|-------|----------------|
| `primary` | Interactive elements, CTAs | `bg-primary`, `text-primary` |
| `destructive` | Errors, delete actions | `bg-destructive`, `text-destructive` |
| `success` | Success states | `bg-success`, `text-success` |
| `warning` | Warnings, caution | `bg-warning`, `text-warning` |
| `info` | Informational | `bg-info`, `text-info` |

### Surface Colors

| Color | Usage | Tailwind Class |
|-------|-------|----------------|
| `background` | Page background | `bg-background` |
| `foreground` | Primary text | `text-foreground` |
| `muted` | Subtle backgrounds | `bg-muted` |
| `accent` | Hover states | `bg-accent` |
| `card` | Card backgrounds | `bg-card` |

### Utility Colors

| Color | Usage | Tailwind Class |
|-------|-------|----------------|
| `border` | Borders | `border-border` |
| `input` | Input borders | `border-input` |
| `ring` | Focus rings | `ring-ring` |

---

## Browser Support

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

---

## Support

Contact the WEX Design System team for assistance.

