# NPM Registry README Page - Complete Guide

This guide explains how README files appear on the NPM registry and how to create effective package documentation.

## Table of Contents

1. [How NPM README Works](#how-npm-readme-works)
2. [README Best Practices](#readme-best-practices)
3. [Template for @graphjson Packages](#template-for-graphjson-packages)
4. [Examples from Popular Packages](#examples-from-popular-packages)
5. [Badges and Shields](#badges-and-shields)
6. [Testing Your README](#testing-your-readme)

---

## How NPM README Works

### What Gets Displayed

When you publish a package to NPM, the registry displays your README.md file as the package homepage.

**Source**: The README.md from your package root (for this project: `libs/*/README.md`)

**Location**: Each library should have:
```
libs/core/
  ├── package.json
  ├── README.md          ← This appears on npmjs.com
  └── src/
```

### NPM Package Page Structure

```
npmjs.com/package/@graphjson/core
├── README.md content (main area)
├── Sidebar:
│   ├── Install command
│   ├── Version
│   ├── License
│   ├── Downloads
│   ├── Repository link
│   ├── Homepage
│   └── Dependencies
└── Tabs:
    ├── Code (explore files)
    ├── Dependencies
    └── Versions
```

### Important Notes

- NPM renders Markdown with GitHub-Flavored Markdown (GFM)
- First heading becomes the page title
- Images must use absolute URLs or NPM CDN
- Links should be absolute for external resources

---

## README Best Practices

### 1. Structure Template

```markdown
# Package Name

> One-line description that sells your package

[![npm version](https://badge.fury.io/js/%40graphjson%2Fcore.svg)](https://www.npmjs.com/package/@graphjson/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Brief paragraph explaining what the package does and why someone would use it.

## Features

- ✨ Feature 1
- 🚀 Feature 2
- 💪 Feature 3

## Installation

\`\`\`bash
npm install @graphjson/core
# or
yarn add @graphjson/core
# or
pnpm add @graphjson/core
\`\`\`

## Quick Start

\`\`\`typescript
import { generateDocument } from '@graphjson/core';

// Simple example that shows immediate value
const result = generateDocument({
  query: {
    users: {
      select: {
        id: true,
        name: true
      }
    }
  }
});
\`\`\`

## Usage

### Basic Example
[Detailed example with explanation]

### Advanced Example
[More complex use case]

## API Reference

### `functionName(param1, param2)`

Description of what it does.

**Parameters:**
- `param1` (Type): Description
- `param2` (Type): Description

**Returns:** Type - Description

**Example:**
\`\`\`typescript
const result = functionName('value', 123);
\`\`\`

## Configuration

[If applicable]

## Related Packages

- [@graphjson/ast](https://www.npmjs.com/package/@graphjson/ast) - AST utilities
- [@graphjson/printer](https://www.npmjs.com/package/@graphjson/printer) - Query printer

## Contributing

Contributions welcome! See [CONTRIBUTING.md](link) for guidelines.

## License

MIT © [Your Name]
```

### 2. Essential Sections

**Must Have:**
- Clear title
- One-line description
- Installation instructions
- Quick start example
- API documentation

**Should Have:**
- Features list
- Usage examples
- Configuration options
- License

**Nice to Have:**
- Badges
- Table of contents (for long READMEs)
- Related packages
- Contributing guidelines
- Changelog link

### 3. Writing Tips

✅ **Do:**
- Start with the most common use case
- Use code examples generously
- Keep language clear and concise
- Show output/results where helpful
- Link to full documentation if available

❌ **Don't:**
- Assume prior knowledge
- Use jargon without explanation
- Make examples too complex
- Forget to show imports
- Leave out installation instructions

---

## Template for @graphjson Packages

Here's a customized template for your GraphJSON packages:

```markdown
# @graphjson/core

> Transform JSON queries into GraphQL queries with ease

[![npm version](https://badge.fury.io/js/%40graphjson%2Fcore.svg)](https://www.npmjs.com/package/@graphjson/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

GraphJSON Core provides utilities to convert JSON-based query definitions into proper GraphQL AST and executable documents.

## Why GraphJSON Core?

- 🎯 **Type-safe** - Full TypeScript support
- 📝 **JSON-based** - Write queries in JSON format
- 🔄 **GraphQL Compatible** - Generates valid GraphQL AST
- 🚀 **Zero Dependencies** - Lightweight and fast

## Installation

\`\`\`bash
npm install @graphjson/core
\`\`\`

## Quick Start

\`\`\`typescript
import { generateDocument } from '@graphjson/core';

const jsonQuery = {
  query: {
    users: {
      args: { limit: 10 },
      select: {
        id: true,
        name: true,
        email: true
      }
    }
  }
};

const { ast, variables } = generateDocument(jsonQuery);

// Use with GraphQL client
const result = await client.execute(ast, variables);
\`\`\`

## Features

### Generate GraphQL Documents

Transform JSON queries into GraphQL DocumentNode:

\`\`\`typescript
import { generateDocument } from '@graphjson/core';

const result = generateDocument({
  query: {
    user: {
      args: { id: "123" },
      select: {
        id: true,
        profile: {
          select: {
            avatar: true,
            bio: true
          }
        }
      }
    }
  }
});
\`\`\`

### Variable Support

Use GraphQL variables for dynamic queries:

\`\`\`typescript
const result = generateDocument({
  query: {
    users: {
      args: {
        limit: { $var: "limit", type: "Int!", default: 10 }
      },
      select: {
        id: true,
        name: true
      }
    }
  }
});

// Result includes variables object
console.log(result.variables); // { limit: 10 }
\`\`\`

## API Reference

### `generateDocument(json: JsonDocument): GenerateResult`

Converts a JSON query definition to a GraphQL DocumentNode.

**Parameters:**
- `json` (JsonDocument): The JSON query definition

**Returns:** `GenerateResult` object with:
- `ast` (DocumentNode): GraphQL AST
- `variables` (Record<string, any>): Variable values

**Example:**
\`\`\`typescript
const { ast, variables } = generateDocument({
  query: { users: { select: { id: true } } }
});
\`\`\`

### `applyPlugins(document: DocumentNode, plugins: GraphJsonPlugin[]): DocumentNode`

Applies transformation plugins to a GraphQL document.

**Parameters:**
- `document` (DocumentNode): The GraphQL AST
- `plugins` (GraphJsonPlugin[]): Array of plugins to apply

**Returns:** Transformed DocumentNode

**Example:**
\`\`\`typescript
import { applyPlugins } from '@graphjson/core';
import { relayPagination } from '@graphjson/presets';

const transformed = applyPlugins(document, [relayPagination()]);
\`\`\`

## TypeScript Support

Full TypeScript definitions included. Import types:

\`\`\`typescript
import type { JsonDocument, JsonField } from '@graphjson/core';
\`\`\`

## Related Packages

This package is part of the GraphJSON ecosystem:

- [@graphjson/json-dsl](https://www.npmjs.com/package/@graphjson/json-dsl) - JSON DSL type definitions
- [@graphjson/ast](https://www.npmjs.com/package/@graphjson/ast) - AST building utilities
- [@graphjson/printer](https://www.npmjs.com/package/@graphjson/printer) - Query string printer
- [@graphjson/plugins](https://www.npmjs.com/package/@graphjson/plugins) - Plugin system
- [@graphjson/presets](https://www.npmjs.com/package/@graphjson/presets) - Common presets
- [@graphjson/sdk](https://www.npmjs.com/package/@graphjson/sdk) - High-level SDK

## Examples

Check out the [examples directory](https://github.com/NexaLeaf/graphjson/tree/main/examples) for more usage examples.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](https://github.com/NexaLeaf/graphjson/blob/main/CONTRIBUTING.md).

## License

MIT © NexaLeaf
```

---

## Examples from Popular Packages

### Example 1: React (Concise & Clear)

```markdown
# React

A JavaScript library for building user interfaces.

## Installation

npm install react

## Usage

\`\`\`jsx
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
\`\`\`

## Documentation

Visit https://react.dev
```

**Why it works:**
- Immediate value proposition
- Ultra-simple installation
- Minimal but complete example
- Links to full docs

### Example 2: Lodash (Organized & Comprehensive)

```markdown
# lodash

A modern JavaScript utility library delivering modularity, performance & extras.

## Installation

npm install lodash

## Usage

\`\`\`javascript
const _ = require('lodash');

_.defaults({ 'a': 1 }, { 'a': 3, 'b': 2 });
// → { 'a': 1, 'b': 2 }
\`\`\`

## Features

- ~100% Code Coverage
- Follows semantic versioning
- Modular methods
```

**Why it works:**
- Clear positioning
- Shows common use case
- Highlights key benefits

### Example 3: TypeScript (Technical but Accessible)

```markdown
# TypeScript

TypeScript extends JavaScript by adding types.

## Installation

npm install -D typescript

## Quick Start

1. Install TypeScript
2. Create tsconfig.json
3. Write .ts files
4. Compile with `tsc`

## Example

\`\`\`typescript
function greet(person: string): string {
  return "Hello, " + person;
}
\`\`\`
```

**Why it works:**
- Step-by-step for beginners
- Shows type system immediately
- Clear progression

---

## Badges and Shields

### Essential Badges

Add these to the top of your README:

```markdown
[![npm version](https://badge.fury.io/js/%40graphjson%2Fcore.svg)](https://www.npmjs.com/package/@graphjson/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![CI](https://github.com/NexaLeaf/graphjson/workflows/CI/badge.svg)](https://github.com/NexaLeaf/graphjson/actions)
```

### Using shields.io

Format: `https://img.shields.io/badge/LABEL-MESSAGE-COLOR`

Examples:
```markdown
![npm](https://img.shields.io/npm/v/@graphjson/core)
![downloads](https://img.shields.io/npm/dm/@graphjson/core)
![bundle size](https://img.shields.io/bundlephobia/minzip/@graphjson/core)
![dependencies](https://img.shields.io/librariesio/release/npm/@graphjson/core)
```

### Dynamic Badges (Auto-Update)

```markdown
![Version](https://img.shields.io/npm/v/@graphjson/core?style=flat-square)
![Downloads](https://img.shields.io/npm/dt/@graphjson/core?style=flat-square)
![License](https://img.shields.io/github/license/NexaLeaf/graphjson?style=flat-square)
```

---

## Testing Your README

### 1. Preview Locally

Use a Markdown previewer:

```bash
# In VS Code: Cmd+Shift+V (Mac) or Ctrl+Shift+V (Windows)

# Or use a CLI tool
npm install -g markdown-preview
markdown-preview README.md
```

### 2. Test on NPM (Before Publishing)

Use the NPM preview:

```bash
# Pack the package
cd dist/libs/core
npm pack

# Extract and view
tar -xzf graphjson-core-0.0.1.tgz
cat package/README.md
```

### 3. Publish to Verdaccio First

```bash
# Start local registry
npx nx local-registry &

# Publish locally
npx nx release publish --registry=http://localhost:4873

# View at http://localhost:4873/-/web/detail/@graphjson/core
```

### 4. Use readme-preview Tool

```bash
# Install
npm install -g @npmcli/readme

# Preview
readme README.md
```

---

## README Optimization

### Length Guidelines

- **Ideal**: 500-1500 words
- **Maximum**: Keep under 3000 words
- **Too short**: Less than 200 words seems incomplete
- **Too long**: Move detailed docs to external site

### Structure for Scannability

Use hierarchical headings:

```markdown
# H1: Package Name (only one)
## H2: Major sections
### H3: Subsections
#### H4: Details
```

Add visual breaks:

```markdown
---

## Next Section
```

Use lists and tables:

```markdown
## Features

| Feature | Description |
|---------|-------------|
| Fast | Lightning fast parsing |
| Small | Only 5kb minified |
```

### Code Blocks Best Practices

Always specify the language:

```markdown
\`\`\`typescript
// TypeScript code with syntax highlighting
\`\`\`

\`\`\`bash
# Shell commands
npm install package
\`\`\`

\`\`\`json
{
  "config": "example"
}
\`\`\`
```

### Images and Assets

**For NPM README**, use absolute URLs:

```markdown
<!-- ❌ Won't work on NPM -->
![Logo](./logo.png)

<!-- ✅ Works on NPM -->
![Logo](https://raw.githubusercontent.com/NexaLeaf/graphjson/main/assets/logo.png)

<!-- ✅ Using NPM CDN -->
![Logo](https://cdn.jsdelivr.net/npm/@graphjson/core/logo.png)
```

---

## Complete README Template for @graphjson Packages

Here's a production-ready template:

```markdown
# @graphjson/{PACKAGE_NAME}

> {One-line description}

[![npm version](https://img.shields.io/npm/v/@graphjson/{PACKAGE_NAME})](https://www.npmjs.com/package/@graphjson/{PACKAGE_NAME})
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

{2-3 sentence description of what this package does and why developers would use it}

## Features

- ✨ {Feature 1}
- 🚀 {Feature 2}
- 💪 {Feature 3}
- 📦 {Feature 4}

## Installation

\`\`\`bash
npm install @graphjson/{PACKAGE_NAME}
\`\`\`

## Quick Start

\`\`\`typescript
import { mainFunction } from '@graphjson/{PACKAGE_NAME}';

// Simple example showing primary use case
const result = mainFunction({
  // config
});

console.log(result);
// Expected output
\`\`\`

## Usage

### Basic Usage

{Simple, common use case with explanation}

\`\`\`typescript
// Code example
\`\`\`

### Advanced Usage

{More complex scenario}

\`\`\`typescript
// Advanced example
\`\`\`

## API

### Main Exports

#### `functionName(params): ReturnType`

{Description}

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| param1 | string | Yes | {description} |
| param2 | number | No | {description} |

**Returns:** `ReturnType` - {description}

**Example:**

\`\`\`typescript
const result = functionName('value', 42);
\`\`\`

## TypeScript

Full TypeScript support with type definitions included.

\`\`\`typescript
import type { JsonDocument, JsonField } from '@graphjson/{PACKAGE_NAME}';

const query: JsonDocument = {
  // Fully typed
};
\`\`\`

## Examples

See the [examples directory](https://github.com/NexaLeaf/graphjson/tree/main/examples) for complete working examples.

## Related Packages

Part of the GraphJSON ecosystem:

- [@graphjson/json-dsl](https://www.npmjs.com/package/@graphjson/json-dsl) - JSON DSL types
- [@graphjson/ast](https://www.npmjs.com/package/@graphjson/ast) - AST utilities
- [@graphjson/printer](https://www.npmjs.com/package/@graphjson/printer) - Query printer
- [@graphjson/sdk](https://www.npmjs.com/package/@graphjson/sdk) - High-level SDK

## Contributing

Contributions welcome! Please read our [Contributing Guide](https://github.com/NexaLeaf/graphjson/blob/main/CONTRIBUTING.md).

## License

MIT © [NexaLeaf](https://github.com/NexaLeaf)

## Support

- 📖 [Documentation](https://github.com/NexaLeaf/graphjson#readme)
- 🐛 [Issue Tracker](https://github.com/NexaLeaf/graphjson/issues)
- 💬 [Discussions](https://github.com/NexaLeaf/graphjson/discussions)
```

---

## Real-World Example: @graphjson/core README

Here's what the README for your core package could look like:

```markdown
# @graphjson/core

> Transform JSON queries into GraphQL documents with variables and plugins

[![npm version](https://img.shields.io/npm/v/@graphjson/core)](https://www.npmjs.com/package/@graphjson/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

GraphJSON Core is the heart of the GraphJSON ecosystem, providing tools to convert JSON-based query definitions into executable GraphQL documents with full variable support and extensibility through plugins.

## Why Use This?

- 📝 Write GraphQL queries in JSON format
- 🔄 Automatic variable extraction and management
- 🎨 Extensible plugin system
- 🎯 Full TypeScript support
- 🚀 Zero runtime dependencies

## Installation

\`\`\`bash
npm install @graphjson/core @graphjson/json-dsl
\`\`\`

## Quick Start

\`\`\`typescript
import { generateDocument } from '@graphjson/core';

const { ast, variables } = generateDocument({
  query: {
    users: {
      args: {
        limit: { $var: 'limit', type: 'Int!', default: 10 }
      },
      select: {
        id: true,
        name: true,
        posts: {
          select: {
            title: true,
            content: true
          }
        }
      }
    }
  }
});

// Use with any GraphQL client
const result = await graphqlClient.execute(ast, variables);
\`\`\`

## Features

### Document Generation

Convert JSON to GraphQL DocumentNode:

\`\`\`typescript
const { ast, variables } = generateDocument({
  query: { /* ... */ },
  mutation: { /* ... */ },
  subscription: { /* ... */ }
});
\`\`\`

### Variable Management

Automatically extract and track variables:

\`\`\`typescript
const result = generateDocument({
  query: {
    user: {
      args: {
        id: { $var: 'userId', type: 'ID!', default: '123' }
      },
      select: { name: true }
    }
  }
});

// Variables extracted automatically
console.log(result.variables); // { userId: '123' }
\`\`\`

### Plugin System

Transform documents with plugins:

\`\`\`typescript
import { applyPlugins } from '@graphjson/core';
import { relayPagination } from '@graphjson/presets';

const transformed = applyPlugins(document, [
  relayPagination(),
  customPlugin()
]);
\`\`\`

## API

### `generateDocument(json: JsonDocument): GenerateResult`

Generates a GraphQL document from JSON definition.

**Parameters:**
- `json.query` - Query operations
- `json.mutation` - Mutation operations  
- `json.subscription` - Subscription operations

**Returns:**
- `ast`: GraphQL DocumentNode
- `variables`: Record of variable values

### `applyPlugins(document, plugins): DocumentNode`

Applies transformation plugins to a document.

**Parameters:**
- `document`: GraphQL DocumentNode
- `plugins`: Array of GraphJsonPlugin

**Returns:** Transformed DocumentNode

## TypeScript

\`\`\`typescript
import type {
  JsonDocument,
  JsonField,
  JsonVariable,
  GenerateResult
} from '@graphjson/core';
\`\`\`

## Examples

- [Basic Usage](https://github.com/NexaLeaf/graphjson/tree/main/examples/basic)
- [With Variables](https://github.com/NexaLeaf/graphjson/tree/main/examples/variables)
- [Advanced Queries](https://github.com/NexaLeaf/graphjson/tree/main/examples/advanced)

## Ecosystem

| Package | Description |
|---------|-------------|
| [@graphjson/json-dsl](https://www.npmjs.com/package/@graphjson/json-dsl) | Type definitions for JSON DSL |
| [@graphjson/ast](https://www.npmjs.com/package/@graphjson/ast) | AST building utilities |
| [@graphjson/printer](https://www.npmjs.com/package/@graphjson/printer) | Print queries as strings |
| [@graphjson/sdk](https://www.npmjs.com/package/@graphjson/sdk) | High-level SDK |

## Contributing

See [CONTRIBUTING.md](https://github.com/NexaLeaf/graphjson/blob/main/CONTRIBUTING.md)

## License

MIT
```

---

## README Checklist

Before publishing, verify your README has:

- [ ] Clear package name as H1
- [ ] One-line description
- [ ] Installation instructions
- [ ] Quick start example (< 10 lines)
- [ ] At least one detailed usage example
- [ ] API documentation for main exports
- [ ] License information
- [ ] Links to related packages (if any)
- [ ] Repository/issues links
- [ ] All code blocks have language specified
- [ ] All images use absolute URLs
- [ ] No broken links
- [ ] No placeholder text like TODO or TBD

---

## Tools to Help

### 1. Markdown Linter

```bash
npm install -g markdownlint-cli

markdownlint README.md
```

### 2. Link Checker

```bash
npm install -g markdown-link-check

markdown-link-check README.md
```

### 3. README Score

Check README quality:

```bash
npx readme-score-api README.md
```

### 4. Generate TOC

```bash
npm install -g markdown-toc

markdown-toc -i README.md
```

---

## NPM Package Page SEO

### Metadata in package.json

NPM uses this for search and display:

```json
{
  "name": "@graphjson/core",
  "description": "Transform JSON queries into GraphQL documents",
  "keywords": [
    "graphql",
    "json",
    "query",
    "ast",
    "document",
    "graphql-query",
    "query-builder"
  ],
  "homepage": "https://github.com/NexaLeaf/graphjson#readme",
  "repository": {
    "type": "git",
    "url": "https://github.com/NexaLeaf/graphjson.git",
    "directory": "libs/core"
  }
}
```

### Keywords Strategy

Choose 5-10 relevant keywords:
- Primary technology (graphql, json)
- Use case (query, builder, parser)
- Related concepts (ast, document)
- Alternatives (graphql-query, query-dsl)

---

## Publishing README Updates

### Updating README Without Version Bump

```bash
# 1. Update README.md in libs/core/
# 2. Build the package
npx nx build core

# 3. Publish (version stays the same)
cd dist/libs/core
npm publish

# NPM will update the README on the package page
```

### README-Only Updates

If you only changed documentation:

```bash
# Commit with docs: prefix (won't trigger version bump)
git commit -m "docs: update README examples"

# Publish manually
cd dist/libs/core
npm publish
```

---

## Maintenance Tips

### Keep README in Sync

When making changes:

1. Update code
2. Update examples in README
3. Update version in package.json (via nx release)
4. Ensure examples work
5. Publish

### Regular README Reviews

Check quarterly:
- [ ] Examples still work with current API
- [ ] Links not broken
- [ ] Badges still relevant
- [ ] Screenshots up to date (if any)
- [ ] Installation instructions current

---

## Resources

- [NPM README Guidelines](https://docs.npmjs.com/about-package-readme-files)
- [GitHub Flavored Markdown Spec](https://github.github.com/gfm/)
- [Shields.io Badge Generator](https://shields.io/)
- [Awesome README Examples](https://github.com/matiassingers/awesome-readme)
- [Make a README](https://www.makeareadme.com/)

---

## Summary

A great NPM README:

1. **Hooks** readers immediately with value proposition
2. **Shows** don't tell (use code examples)
3. **Guides** users from installation to first success
4. **Documents** API clearly
5. **Links** to more resources

Your README is the **first impression** developers have of your package. Make it count! 🎯