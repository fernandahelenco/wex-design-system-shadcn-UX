# @wex/design-tokens - Package Maintenance Guide

This guide is for the Design Engineering team responsible for maintaining and publishing the `@wex/design-tokens` package.

---

## Table of Contents

1. [Package Overview](#package-overview)
2. [Token Layer Architecture](#token-layer-architecture)
3. [Versioning Strategy](#versioning-strategy)
4. [Updating Tokens from Theme Builder](#updating-tokens-from-theme-builder)
5. [Publishing to Artifactory](#publishing-to-artifactory)
6. [Testing Checklist](#testing-checklist)
7. [Troubleshooting](#troubleshooting)

---

## Package Overview

### Location

```
packages/design-tokens/
├── package.json          # NPM package config
├── README.md             # Consumer documentation
├── tailwind-preset.js    # Tailwind configuration preset
└── dist/
    └── css/
        ├── tokens.css            # Layer 1: Primitives & semantic tokens
        ├── shadcn-bridge.css     # Layer 2: Maps WEX → shadcn variables
        └── components-bridge.css # Layer 3: Component-specific slots
```

### What Gets Published

Only these files are included in the published package (defined in `package.json` → `files`):

- `dist/` folder
  - `dist/css/tokens.css` - Core design tokens (palette ramps, semantic roles)
  - `dist/css/shadcn-bridge.css` - shadcn/Spartan compatibility layer
  - `dist/css/components-bridge.css` - Component-level token slots
- `tailwind-preset.js`
- `README.md`

---

## Token Layer Architecture

The package follows a 4-layer token architecture:

```
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 1: tokens.css                                                │
│  ─────────────────────────────────────────────────────────────────  │
│  Primitives (palette ramps) + Semantic roles                        │
│  --wex-palette-blue-700, --wex-primary, --wex-destructive           │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 2: shadcn-bridge.css                                         │
│  ─────────────────────────────────────────────────────────────────  │
│  Maps WEX tokens → shadcn required variable names                   │
│  --primary: var(--wex-primary)                                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 3: components-bridge.css                                     │
│  ─────────────────────────────────────────────────────────────────  │
│  Component-specific slots for granular theming                      │
│  --wex-component-button-primary-bg: var(--wex-primary)              │
│  --wex-component-input-border: var(--wex-input-border)              │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 4: tailwind-preset.js                                        │
│  ─────────────────────────────────────────────────────────────────  │
│  Exposes all CSS variables as Tailwind utilities                    │
│  bg-wex-button-primary-bg, border-wex-input-border                  │
└─────────────────────────────────────────────────────────────────────┘
```

| Layer | File | Purpose |
|-------|------|---------|
| **1** | `tokens.css` | Primitives (palette ramps) + Semantic roles |
| **2** | `shadcn-bridge.css` | Maps WEX tokens → shadcn variable names |
| **3** | `components-bridge.css` | Component-specific slots (buttons, inputs, etc.) |
| **4** | `tailwind-preset.js` | Exposes all tokens as Tailwind utilities |

**Dependency chain:** Layer 3 → Layer 1 → (resolved values)

### Why Layer 3 Exists

Layer 3 solves the "primary bleed" problem where generic tokens like `--primary` are overused across components. With Layer 3:

- **Isolated customization** - Change button colors without affecting inputs
- **Variant richness** - Each button variant (primary, destructive, success) has explicit slots
- **Disabled states** - Components have dedicated `disabled-bg`, `disabled-fg`, `disabled-border` tokens
- **PrimeNG-level granularity** - Enables rich theming comparable to PrimeNG

---

## Versioning Strategy

Follow [Semantic Versioning](https://semver.org/):

| Change Type | Version Bump | Example | When to Use |
|-------------|--------------|---------|-------------|
| **Fix a typo** in token name | Patch | 1.0.0 → 1.0.1 | Correcting `--wex-primay` → `--wex-primary` |
| **Adjust a single color value** | Patch | 1.0.0 → 1.0.1 | Blue-700 shifts 5% lighter |
| **Add new tokens** (non-breaking) | Minor | 1.0.0 → 1.1.0 | Adding `--wex-accent-hover` |
| **Add new component tokens** | Minor | 1.0.0 → 1.1.0 | Adding `--wex-component-datepicker-*` |
| **Palette refresh** (multiple colors) | Minor | 1.0.0 → 1.1.0 | Designer updates primary, success, and warning colors |
| **Brand color change** | Minor | 1.0.0 → 1.1.0 | WEX Red changes to new brand standard |
| **Rename a token** | Major | 1.0.0 → 2.0.0 | `--wex-primary` → `--wex-brand-primary` |
| **Remove a token** | Major | 1.0.0 → 2.0.0 | Removing deprecated `--wex-old-token` |
| **Breaking structure change** | Major | 1.0.0 → 2.0.0 | Changing from HSL to RGB format |

### Rule of Thumb

- **If existing consumer code still works** → Patch or Minor
- **If existing consumer code breaks** → Major

### Changelog

When bumping versions, add an entry to the release notes in `package.json` or a `CHANGELOG.md` file:

```markdown
## [1.2.0] - 2025-01-15

### Changed
- Updated primary color palette based on designer feedback
- Adjusted warning-foreground contrast for better accessibility

### Added
- New `--wex-accent-hover` token
- Layer 3 component tokens for DatePicker
```

---

## Updating Tokens from Theme Builder

When a designer exports a new theme from the Theme Builder:

### Step 1: Receive the Export

The Theme Builder exports all 3 layers. The designer will provide either:
- Downloaded CSS files, or
- CSS code copied from the Theme Builder export panel

### Step 2: Update tokens.css (Layer 1)

Replace the contents of `packages/design-tokens/dist/css/tokens.css` with the exported CSS.

**Option A:** If you received a file:
```bash
cp ~/Downloads/wex-tokens-export.css packages/design-tokens/dist/css/tokens.css
```

**Option B:** If you received code:
1. Open `packages/design-tokens/dist/css/tokens.css`
2. Replace the entire contents with the exported CSS
3. Save the file

### Step 3: Update components-bridge.css (Layer 3)

If the designer customized component-level tokens (e.g., changed button colors):

```bash
cp ~/Downloads/wex-components-bridge.css packages/design-tokens/dist/css/components-bridge.css
```

**Important:** Component tokens reference Layer 1 semantic tokens. Always update `tokens.css` first if palette values changed.

### Step 4: Verify the Bridges

Check that both bridge files correctly reference the token names:
- `shadcn-bridge.css` → references `--wex-*` tokens
- `components-bridge.css` → references `--wex-*` tokens (NOT raw hex values)

If token names changed (rare), update both bridge files.

### Step 5: Test Locally

See [Testing Checklist](#testing-checklist) below.

### Step 6: Bump Version

In `packages/design-tokens/package.json`, update the version:

```json
{
  "version": "1.2.0"
}
```

### Step 7: Commit and Publish

```bash
git add packages/design-tokens/
git commit -m "chore(tokens): Update design tokens to v1.2.0"
git push origin main

# Then publish (see next section)
```

---

## Publishing to Artifactory

### First-Time Setup

#### 1. Create an `.npmrc` file

Create a file at `packages/design-tokens/.npmrc`:

```ini
@wex:registry=https://artifactory.wexinc.com/artifactory/api/npm/npm-local/
//artifactory.wexinc.com/artifactory/api/npm/npm-local/:_authToken=${ARTIFACTORY_TOKEN}
```

> **Note:** Replace `artifactory.wexinc.com` with your actual Artifactory URL if different.

#### 2. Get Your Artifactory Token

1. Log in to Artifactory (https://artifactory.wexinc.com)
2. Click your username → "Edit Profile" → "Generate API Key" or "Access Tokens"
3. Copy the token

#### 3. Set the Environment Variable

**macOS/Linux:**
```bash
export ARTIFACTORY_TOKEN=your-token-here
```

**Windows (PowerShell):**
```powershell
$env:ARTIFACTORY_TOKEN = "your-token-here"
```

**Permanent (add to shell profile):**
```bash
# Add to ~/.zshrc or ~/.bashrc
export ARTIFACTORY_TOKEN=your-token-here
```

#### Alternative: Use npm login

Instead of setting a token, you can use interactive login:

```bash
cd packages/design-tokens
npm login --registry=https://artifactory.wexinc.com/artifactory/api/npm/npm-local/
```

You'll be prompted for your Artifactory username and password.

---

### Publishing Steps

#### 1. Navigate to the Package

```bash
cd packages/design-tokens
```

#### 2. Verify You're Logged In

```bash
npm whoami --registry=https://artifactory.wexinc.com/artifactory/api/npm/npm-local/
```

This should print your username. If it fails, re-run the login step.

#### 3. Check What Will Be Published

```bash
npm pack --dry-run
```

This shows which files will be included. Verify it looks correct:
- `dist/css/tokens.css`
- `dist/css/shadcn-bridge.css`
- `dist/css/components-bridge.css`
- `tailwind-preset.js`
- `README.md`
- `package.json`

#### 4. Publish

```bash
npm publish
```

If successful, you'll see:
```
+ @wex/design-tokens@1.2.0
```

#### 5. Verify in Artifactory

1. Go to Artifactory web UI
2. Navigate to `npm-local` → `@wex` → `design-tokens`
3. Confirm the new version appears

---

## Testing Checklist

Before publishing, verify the package works correctly:

### Local Testing

1. **Create a test project** (or use an existing consumer app):
   ```bash
   npm link ../path/to/packages/design-tokens
   ```

2. **Import the CSS** and verify no errors

3. **Check Tailwind classes** work:
   - `bg-primary` applies correct color
   - `text-destructive` applies correct color
   - `bg-wex-button-primary-bg` applies correct color (Layer 3)
   - Dark mode works (add `class="dark"` to root)

4. **Verify in browser DevTools:**
   - CSS variables are defined on `:root`
   - `.dark` overrides are present
   - Layer 3 variables (e.g., `--wex-component-button-primary-bg`) are defined
   - Colors match the Theme Builder preview

### Checklist

#### Layer 1 (tokens.css)
- [ ] `tokens.css` loads without errors
- [ ] Palette variables are defined (e.g., `--wex-palette-blue-700`)
- [ ] Semantic variables are defined (e.g., `--wex-primary`)
- [ ] Dark mode overrides are present

#### Layer 2 (shadcn-bridge.css)
- [ ] `shadcn-bridge.css` loads without errors
- [ ] shadcn variables map correctly (e.g., `--primary` → `--wex-primary`)
- [ ] Tailwind preset applies correctly

#### Layer 3 (components-bridge.css)
- [ ] `components-bridge.css` loads without errors
- [ ] Button tokens are defined (e.g., `--wex-component-button-primary-bg`)
- [ ] Input tokens are defined (e.g., `--wex-component-input-border`)
- [ ] Form control tokens share common values (e.g., `--wex-component-form-border`)
- [ ] Disabled states have explicit tokens

#### Visual Verification
- [ ] Primary color is correct
- [ ] Destructive color is correct
- [ ] Success/Warning/Info colors are correct
- [ ] Dark mode colors switch correctly
- [ ] Focus rings are visible
- [ ] Buttons have correct hover states
- [ ] Disabled buttons have correct muted appearance

---

## Troubleshooting

### "npm ERR! 401 Unauthorized"

**Cause:** Your Artifactory token is invalid or expired.

**Fix:**
1. Generate a new token in Artifactory
2. Update your `ARTIFACTORY_TOKEN` environment variable
3. Try again

### "npm ERR! 403 Forbidden"

**Cause:** You don't have publish permissions.

**Fix:** Contact your Artifactory admin to grant publish access to the `npm-local` repository.

### "Cannot find module '@wex/design-tokens'"

**Cause (for consumers):** The package isn't installed or `.npmrc` isn't configured.

**Fix:** Ensure consumers have an `.npmrc` pointing to Artifactory:
```ini
@wex:registry=https://artifactory.wexinc.com/artifactory/api/npm/npm-local/
```

### "Colors don't match Theme Builder"

**Cause:** The exported CSS wasn't copied correctly.

**Fix:**
1. Re-export from Theme Builder
2. Ensure you copied the ENTIRE CSS content
3. Check for any merge conflicts in the file
4. Verify all 3 layers were updated if needed

### "Tailwind classes not working"

**Cause:** Preset not added to Tailwind config.

**Fix:** Ensure `tailwind.config.js` includes:
```javascript
const wexPreset = require("@wex/design-tokens/tailwind-preset");
module.exports = {
  presets: [wexPreset],
  // ...
};
```

### "Component tokens not applying"

**Cause:** `components-bridge.css` not imported, or imported in wrong order.

**Fix:** Ensure import order is correct:
```css
/* Must be in this order */
@import "@wex/design-tokens/css/tokens";          /* Layer 1 first */
@import "@wex/design-tokens/css/shadcn-bridge";   /* Layer 2 */
@import "@wex/design-tokens/css/components-bridge"; /* Layer 3 last */

@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Questions?

Contact the Design System team or open an issue in the repository.
