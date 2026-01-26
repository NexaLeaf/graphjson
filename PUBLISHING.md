# Publishing NPM Packages - Practical Guide

This guide covers publishing packages from this Nx monorepo to NPM with practical examples.

## Table of Contents

1. [Package Configuration](#package-configuration)
2. [Nx Release Workflow](#nx-release-workflow)
3. [Local Testing with Verdaccio](#local-testing-with-verdaccio)
4. [Publishing to NPM](#publishing-to-npm)
5. [CI/CD Automation](#cicd-automation)
6. [Troubleshooting](#troubleshooting)

---

## Package Configuration

### Essential package.json Fields

Each publishable library needs a properly configured `package.json`. Here's the template:

```json
{
  "name": "@graphjson/package-name",
  "version": "0.0.1",
  "type": "module",
  "description": "Short description of your package",
  "keywords": ["graphql", "json", "query"],
  "author": "Your Name <email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/NexaLeaf/graphjson.git",
    "directory": "libs/package-name"
  },
  "bugs": {
    "url": "https://github.com/NexaLeaf/graphjson/issues"
  },
  "homepage": "https://github.com/NexaLeaf/graphjson#readme",
  "main": "./index.js",
  "types": "./index.d.ts",
  "exports": {
    ".": {
      "types": "./index.d.ts",
      "import": "./index.js"
    }
  },
  "files": [
    "index.js",
    "index.d.ts",
    "**/*.js",
    "**/*.d.ts",
    "README.md",
    "LICENSE"
  ],
  "publishConfig": {
    "access": "public"
  },
  "dependencies": {},
  "peerDependencies": {}
}
```

### Key Fields Explained

- **name**: Scoped package name (e.g., `@graphjson/core`)
- **version**: Managed automatically by Nx release
- **type**: "module" for ES modules
- **exports**: Modern package entry points
- **files**: Whitelist of files to publish
- **publishConfig.access**: "public" for scoped packages
- **peerDependencies**: Dependencies that users should provide

---

## Nx Release Workflow

Your monorepo is already configured with Nx release in `nx.json`:

```json
"release": {
  "projects": ["*", "!utils", "!@org/source"],
  "version": {
    "preVersionCommand": "npx nx run-many -t build"
  }
}
```

### Version Management

#### 1. Preview Changes (Dry Run)
```bash
# See what would be released without making changes
npx nx release --dry-run
```

#### 2. Version Packages
```bash
# Bump versions and update changelogs
npx nx release version

# Specific version bump
npx nx release version patch  # 0.0.1 → 0.0.2
npx nx release version minor  # 0.1.0 → 0.2.0
npx nx release version major  # 1.0.0 → 2.0.0
```

#### 3. Publish to NPM
```bash
# Publish all changed packages
npx nx release publish

# Dry run before publishing
npx nx release publish --dry-run
```

#### 4. Complete Release (Version + Publish)
```bash
# One command to do everything
npx nx release

# With dry run
npx nx release --dry-run
```

### Version Strategy Options

You can configure different versioning strategies in `nx.json`:

```json
"release": {
  "version": {
    "generatorOptions": {
      "packageRoot": "dist/{projectRoot}",
      "currentVersionResolver": "git-tag",
      "specifierSource": "conventional-commits"
    }
  }
}
```

---

## Local Testing with Verdaccio

Before publishing to the public NPM registry, test locally with Verdaccio.

### 1. Start Local Registry

```bash
# Start Verdaccio on port 4873
npx nx local-registry
```

This starts a local NPM registry at `http://localhost:4873`

### 2. Configure NPM to Use Local Registry

```bash
# Point npm to local registry
npm set registry http://localhost:4873

# Or use .npmrc file (recommended)
echo "registry=http://localhost:4873" > .npmrc
```

### 3. Publish to Local Registry

```bash
# Build all packages
npx nx run-many -t build

# Publish to local registry
cd dist/libs/core
npm publish

# Or use Nx release
npx nx release publish --registry=http://localhost:4873
```

### 4. Test Installation

In a separate test directory:

```bash
# Create test project
mkdir test-package && cd test-package
npm init -y

# Configure to use local registry
echo "registry=http://localhost:4873" > .npmrc

# Install your package
npm install @graphjson/core

# Test it
node -e "const core = require('@graphjson/core'); console.log(core);"
```

### 5. Reset to NPM Registry

```bash
# Remove local registry configuration
rm .npmrc

# Or reset npm config
npm config delete registry
```

---

## Publishing to NPM

### Prerequisites

1. **NPM Account**: Create at npmjs.com
2. **Login**: `npm login`
3. **Verify**: `npm whoami`
4. **2FA**: Enable two-factor authentication (recommended)

### Publishing Steps

#### Step 1: Prepare Packages

```bash
# Clean install dependencies
rm -rf node_modules
npm ci

# Run tests
npx nx run-many -t test

# Build all packages
npx nx run-many -t build

# Verify build outputs
ls -la dist/libs/
```

#### Step 2: Version and Publish

```bash
# Dry run first
npx nx release --dry-run

# If everything looks good, do the real release
npx nx release

# This will:
# 1. Build all packages (preVersionCommand)
# 2. Bump versions based on conventional commits
# 3. Update CHANGELOGs
# 4. Create git tags
# 5. Publish to NPM
```

#### Step 3: Push Changes

```bash
# Push commits and tags
git push origin main --follow-tags
```

### Manual Publishing (Alternative)

If you prefer more control:

```bash
# 1. Version packages
npx nx release version

# 2. Review changes
git status
git diff

# 3. Commit changes
git add .
git commit -m "chore: release vX.X.X"

# 4. Publish
npx nx release publish

# 5. Push
git push origin main --follow-tags
```

---

## CI/CD Automation

### GitHub Actions Publishing Workflow

Create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  workflow_dispatch:
  push:
    branches:
      - main

permissions:
  contents: write
  id-token: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Configure Git
        run: |
          git config user.name "GitHub Actions Bot"
          git config user.email "<>"

      - name: Version
        run: |
          npx nx release version --verbose
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Publish to NPM
        run: |
          npx nx release publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
          NPM_CONFIG_PROVENANCE: true

      - name: Push changes
        run: |
          git push origin main --follow-tags
```

### Setup GitHub Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add `NPM_TOKEN`:
   - Create token at npmjs.com (Account Settings → Access Tokens)
   - Choose "Automation" token type
   - Copy and add to GitHub secrets

### NPM Provenance

For enhanced security, use provenance:

```bash
npm publish --provenance
```

This creates a verifiable link between your package and the source code.

---

## Best Practices

### 1. Semantic Versioning

Follow semver (MAJOR.MINOR.PATCH):

- **PATCH** (0.0.x): Bug fixes
- **MINOR** (0.x.0): New features (backward compatible)
- **MAJOR** (x.0.0): Breaking changes

### 2. Conventional Commits

Use conventional commit messages for automatic versioning:

```bash
feat: add new feature        # → minor bump
fix: resolve bug            # → patch bump
feat!: breaking change      # → major bump
docs: update documentation  # → no version bump
chore: update dependencies  # → no version bump
```

### 3. Changelog Generation

Nx automatically generates CHANGELOGs based on commits:

```markdown
## 0.2.0 (2024-01-26)

### Features

* add support for nested queries ([abc123](commit-link))

### Bug Fixes

* fix variable handling ([def456](commit-link))
```

### 4. Pre-publish Checklist

- [ ] All tests passing: `npx nx run-many -t test`
- [ ] Builds successful: `npx nx run-many -t build`
- [ ] Linting clean: `npx nx run-many -t lint`
- [ ] README.md updated
- [ ] CHANGELOGs reviewed
- [ ] Version numbers appropriate
- [ ] Dependencies correct (peer vs regular)

### 5. Package README Template

Each package should have a README.md:

```markdown
# @graphjson/package-name

> Short description

## Installation

\`\`\`bash
npm install @graphjson/package-name
\`\`\`

## Usage

\`\`\`typescript
import { something } from '@graphjson/package-name';

// Example usage
\`\`\`

## API

### function/class name

Description of API

## License

MIT
```

---

## Common Publishing Scenarios

### Scenario 1: First-Time Publish

```bash
# 1. Ensure you're logged in
npm whoami

# 2. Test locally first
npx nx local-registry &
npx nx release --registry=http://localhost:4873

# 3. If successful, publish to NPM
npx nx release
```

### Scenario 2: Patch Release

```bash
# Fix a bug, commit with conventional message
git commit -m "fix: resolve issue with variable parsing"

# Release (will auto-bump patch version)
npx nx release
```

### Scenario 3: Feature Release

```bash
# Add feature, commit
git commit -m "feat: add support for subscriptions"

# Release (will auto-bump minor version)
npx nx release
```

### Scenario 4: Publishing Specific Packages

```bash
# Version only specific projects
npx nx release version --projects=core,sdk

# Publish only specific projects
npx nx release publish --projects=core,sdk
```

### Scenario 5: Beta/Alpha Releases

```bash
# Create pre-release version
npx nx release version --preid=beta

# Result: 0.1.0-beta.0

# Publish with beta tag
npx nx release publish --tag=beta

# Users install with: npm install @graphjson/core@beta
```

---

## Troubleshooting

### Issue: "You must be logged in to publish"

```bash
npm login
# Enter credentials
npm whoami  # Verify
```

### Issue: "Cannot publish over existing version"

- Version already published
- Bump version: `npx nx release version patch`

### Issue: "403 Forbidden"

- Check NPM access rights
- Verify package name isn't taken
- Ensure you're a maintainer

### Issue: "Module not found" after publishing

- Check `exports` field in package.json
- Verify `files` includes all necessary files
- Check `main` and `types` fields

### Issue: Build artifacts missing

- Ensure `preVersionCommand` runs build
- Check dist/ directory exists
- Verify vite.config builds to correct location

---

## Useful Commands Reference

```bash
# Check what would be published
npm pack --dry-run

# View package contents
tar -tzf package-name-version.tgz

# Check package info
npm view @graphjson/core

# Check all versions
npm view @graphjson/core versions

# Deprecate a version
npm deprecate @graphjson/core@0.0.1 "Please upgrade to 0.0.2"

# Unpublish (within 72 hours)
npm unpublish @graphjson/core@0.0.1

# View download stats
npm info @graphjson/core
```

---

## Example: Complete Publishing Flow

### Step-by-Step Example

```bash
# 1. Make changes and commit with conventional messages
git add .
git commit -m "feat: add relay pagination support"
git commit -m "fix: handle null values correctly"

# 2. Run quality checks
npx nx run-many -t lint test build

# 3. Preview what will happen (DRY RUN)
npx nx release --dry-run

# Output shows:
# - Which packages will be updated
# - New version numbers
# - Changelog entries

# 4. If preview looks good, do actual release
npx nx release

# This will:
# ✓ Build all packages
# ✓ Bump versions (patch: 0.0.1 → 0.0.2)
# ✓ Update package.json files
# ✓ Generate/update CHANGELOG.md
# ✓ Create git commit
# ✓ Create git tag (v0.0.2)
# ✓ Publish to NPM
# ✓ Show success message

# 5. Push to GitHub
git push origin main --follow-tags

# 6. Verify on NPM
npm view @graphjson/core
```

---

## Advanced Topics

### Monorepo Publishing Strategy

**Independent Versioning** (Current Setup):
- Each package has its own version
- Packages can be released independently
- More flexible for consumers

**Fixed/Lockstep Versioning**:
```json
"release": {
  "version": {
    "generator": "@nx/js:release-version",
    "generatorOptions": {
      "versionPrefix": "v",
      "currentVersionResolver": "git-tag"
    }
  }
}
```

### Custom Release Configuration

Create `release.config.json`:

```json
{
  "projectsRelationship": "independent",
  "version": {
    "conventionalCommits": true,
    "preid": "",
    "generatorOptions": {
      "currentVersionResolver": "git-tag",
      "specifierSource": "conventional-commits"
    }
  },
  "changelog": {
    "projectChangelogs": {
      "createRelease": "github",
      "renderOptions": {
        "authors": true,
        "commitReferences": true,
        "versionTitleDate": true
      }
    }
  }
}
```

### Package Access Control

```bash
# Make package public
npm access public @graphjson/core

# Make package restricted (paid)
npm access restricted @graphjson/core

# Grant access to user
npm owner add username @graphjson/core

# List owners
npm owner ls @graphjson/core
```

---

## Quality Assurance

### Pre-Publish Checklist Script

Create `scripts/pre-publish-check.sh`:

```bash
#!/bin/bash
set -e

echo "🔍 Running pre-publish checks..."

echo "✓ Linting..."
npx nx run-many -t lint

echo "✓ Testing..."
npx nx run-many -t test

echo "✓ Building..."
npx nx run-many -t build

echo "✓ Type checking..."
npx nx run-many -t typecheck

echo "✅ All checks passed! Ready to publish."
```

Make it executable:
```bash
chmod +x scripts/pre-publish-check.sh
./scripts/pre-publish-check.sh
```

---

## Resources

- [NPM Documentation](https://docs.npmjs.com/)
- [Nx Release Documentation](https://nx.dev/features/manage-releases)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [NPM Provenance](https://docs.npmjs.com/generating-provenance-statements)

---

## Quick Reference Card

| Task | Command |
|------|---------|
| Preview release | `npx nx release --dry-run` |
| Version packages | `npx nx release version` |
| Publish packages | `npx nx release publish` |
| Complete release | `npx nx release` |
| Patch version | `npx nx release version patch` |
| Minor version | `npx nx release version minor` |
| Major version | `npx nx release version major` |
| Start local registry | `npx nx local-registry` |
| View package info | `npm view @graphjson/core` |
| Pack for inspection | `npm pack --dry-run` |

---

## Your Current Setup Status

✅ Nx release configured  
✅ Local registry available (Verdaccio)  
✅ Pre-version build configured  
✅ Scoped packages (@graphjson/*)  
⚠️ Need to add NPM_TOKEN to GitHub secrets for CI/CD  
⚠️ Consider adding release workflow to GitHub Actions  

Ready to publish! 🚀