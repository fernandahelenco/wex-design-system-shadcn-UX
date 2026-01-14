# Publishing @wex Packages to Artifactory

This guide covers how to build and publish the WEX Design System packages to Artifactory so they can be consumed as npm dependencies.

---

## Package Overview

| Package | Description | Dependency |
|---------|-------------|------------|
| `@wex/design-tokens` | CSS variables, Tailwind preset | None (standalone) |
| `@wex/components` | React component library | Depends on `@wex/design-tokens` |

**Publish order:** Always publish `@wex/design-tokens` first if both have changes.

---

## Prerequisites

### 1. Artifactory Access

You need publish permissions to the `npm-local` repository in Artifactory.

### 2. Configure npm Authentication

Create/update `~/.npmrc` (your home directory):

```ini
@wex:registry=https://artifactory.wexinc.com/artifactory/api/npm/npm-local/
//artifactory.wexinc.com/artifactory/api/npm/npm-local/:_authToken=${ARTIFACTORY_TOKEN}
```

### 3. Set Your Artifactory Token

1. Log in to https://artifactory.wexinc.com
2. Click your username → "Edit Profile" → "Access Tokens"
3. Generate a token and copy it

**Set the environment variable:**

```bash
# Add to ~/.zshrc or ~/.bashrc for persistence
export ARTIFACTORY_TOKEN=your-token-here
```

### 4. Verify Authentication

```bash
npm whoami --registry=https://artifactory.wexinc.com/artifactory/api/npm/npm-local/
```

Should print your username.

---

## Publishing @wex/design-tokens

The design-tokens package is CSS-only and doesn't require a build step.

### Step 1: Navigate to the Package

```bash
cd packages/design-tokens
```

### Step 2: Bump the Version

Edit `package.json` and update the version following semver:

```json
{
  "version": "1.2.0"
}
```

| Change Type | Version Bump |
|-------------|--------------|
| Color value tweaks | Patch (1.0.0 → 1.0.1) |
| Add new tokens | Minor (1.0.0 → 1.1.0) |
| Rename/remove tokens | Major (1.0.0 → 2.0.0) |

### Step 3: Preview What Gets Published

```bash
npm pack --dry-run
```

Verify these files are included:
- `dist/css/tokens.css`
- `dist/css/shadcn-bridge.css`
- `dist/css/components-bridge.css`
- `dist/css/index.css`
- `tailwind-preset.js`
- `README.md`

### Step 4: Publish

```bash
npm publish
```

Success output:
```
+ @wex/design-tokens@1.2.0
```

---

## Publishing @wex/components

The components package requires a build step before publishing.

### Step 1: Navigate to the Package

```bash
cd packages/wex-components
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Build the Package

```bash
npm run build
```

This runs `tsup` and creates:
- `dist/index.js` (ESM)
- `dist/index.cjs` (CommonJS)
- `dist/index.d.ts` (TypeScript declarations)

### Step 4: Bump the Version

Edit `package.json`:

```json
{
  "version": "1.2.0"
}
```

| Change Type | Version Bump |
|-------------|--------------|
| Bug fixes in components | Patch (1.0.0 → 1.0.1) |
| Add new components | Minor (1.0.0 → 1.1.0) |
| Breaking prop changes | Major (1.0.0 → 2.0.0) |

### Step 5: Update design-tokens Peer Dependency (if needed)

If you just published a new major version of `@wex/design-tokens`, update the peer dependency:

```json
{
  "peerDependencies": {
    "@wex/design-tokens": "^2.0.0"
  }
}
```

### Step 6: Preview What Gets Published

```bash
npm pack --dry-run
```

Verify these files are included:
- `dist/index.js`
- `dist/index.cjs`
- `dist/index.d.ts`
- `tailwind-preset.js`
- `tailwind-preset.d.ts`
- `README.md`

### Step 7: Publish

```bash
npm publish
```

Success output:
```
+ @wex/components@1.2.0
```

---

## Coordinated Releases

When both packages change, follow this order:

### 1. Publish design-tokens First

```bash
cd packages/design-tokens
# bump version in package.json
npm publish
```

### 2. Update components Peer Dependency

If design-tokens had a major version bump:

```bash
cd packages/wex-components
# Edit package.json: update @wex/design-tokens peer dependency version
```

### 3. Publish components

```bash
cd packages/wex-components
npm run build
# bump version in package.json
npm publish
```

---

## Verifying in Artifactory

After publishing, verify the packages exist:

1. Go to https://artifactory.wexinc.com
2. Navigate to: Artifacts → `npm-local` → `@wex`
3. Confirm both packages show the correct versions

---

## Consumer Installation

After publishing, consumers can install:

```bash
# Install both packages
npm install @wex/design-tokens @wex/components

# Or just design-tokens (for CSS variables only)
npm install @wex/design-tokens
```

They'll need `.npmrc` configured:

```ini
@wex:registry=https://artifactory.wexinc.com/artifactory/api/npm/npm-local/
```

---

## Troubleshooting

### "npm ERR! 401 Unauthorized"

Your token is invalid or expired. Generate a new one in Artifactory.

### "npm ERR! 403 Forbidden"

You don't have publish permissions. Contact your Artifactory admin.

### "npm ERR! 402 Payment Required" or version conflict

The version already exists. Bump to a new version number.

### Build fails for @wex/components

Ensure you have the correct Node version and dependencies:

```bash
node --version  # Should be 18+
npm install
npm run build
```

### Components don't pick up new tokens

Consumers need to update both packages:

```bash
npm update @wex/design-tokens @wex/components
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Build components | `cd packages/wex-components && npm run build` |
| Preview publish | `npm pack --dry-run` |
| Publish | `npm publish` |
| Check auth | `npm whoami --registry=https://artifactory.wexinc.com/...` |
