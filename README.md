# WEX Design System

A comprehensive design system built with React, TypeScript, Tailwind CSS, and shadcn/ui primitives.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── ui/          # Base shadcn/ui components
│   └── wex/         # WEX-branded wrapper components
├── docs/
│   ├── components/  # Documentation site components
│   ├── context/     # React contexts (ThemeBuilder, etc.)
│   ├── data/        # Token registries and mappings
│   ├── hooks/       # Custom hooks
│   ├── pages/       # Documentation pages
│   └── utils/       # Utility functions
├── lib/             # Shared utilities (cn, etc.)
└── styles/
    ├── wex.tokens.css       # Core WEX design tokens
    └── wex.shadcn-bridge.css # Semantic token bridge
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run test:unit` | Run unit tests |
| `npm run test:a11y` | Run accessibility tests |
| `npm run generate:token-map` | Regenerate token-component mapping |

## Token Map Generator

The Token Map Generator automatically scans all component files for token usage patterns and generates a mapping file for the Theme Builder.

### When to Run

Run the generator after:
- Adding new components that use design tokens
- Modifying existing components to use different tokens
- Adding new color/token variants

### Usage

```bash
npm run generate:token-map
```

This will:
1. Scan all files in `src/components/` for Tailwind token patterns
2. Detect component names, variants, and states
3. Classify each usage as "easy" (can render statically) or "hard" (requires interaction)
4. Output to `src/docs/data/tokenComponentMap.generated.ts`

### Output

The generator creates a file with:
- `PRIMARY_USAGES`, `DESTRUCTIVE_USAGES`, etc. - Arrays of component usages per token
- `TOKEN_SUMMARY` - Quick counts of usages per token

### Integrating Updates

After running the generator:
1. Review `tokenComponentMap.generated.ts`
2. Compare with the main `tokenComponentMap.ts`
3. Update descriptions and variant names as needed in the main file
4. The Live Preview in Theme Builder uses `tokenComponentMap.ts`

## Theme Builder

The Theme Builder provides a visual interface for customizing design tokens:

### Two-Workflow Architecture

1. **Palette Ramps** - Edit base colors (mode-agnostic, affects both light/dark)
   - Set the 500 shade, auto-generates 50-900 ramp
   - Changes cascade to all semantic tokens referencing the palette

2. **Semantic Tokens** - Edit theme mapping (mode-specific)
   - Intent colors (primary, destructive, success, warning, info)
   - Surface tokens (background, muted, accent)
   - Text tokens (foreground, muted-foreground)

### Live Preview

The Live Preview shows:
- Components affected by the selected token
- All states (checked, unchecked, disabled)
- Interactive states shown as swatches (hover, focus)

### Exporting

Click Export to download your theme overrides as JSON for integration into your app.

## Token Cascade

The design tokens follow a three-layer architecture:

```
Palette Ramps (wex.tokens.css)
  ↓
Semantic Tokens (wex.shadcn-bridge.css)
  ↓
Tailwind Utilities (tailwind.config.ts)
```

Example cascade:
```
--wex-palette-blue-700 → --wex-primary → --primary → bg-primary
```

## Contributing

See the [Contributing](http://localhost:5173/contributing) page in the docs for guidelines on:
- Component development
- Token management
- Testing requirements
- Documentation standards
