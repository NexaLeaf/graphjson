# GraphJSON

A powerful GraphQL query builder and execution framework for TypeScript. GraphJSON enables you to build, parse, and execute GraphQL queries programmatically with a focus on type safety and developer experience.

[![npm version](https://img.shields.io/npm/v/@graphjson/core)](https://www.npmjs.com/package/@graphjson/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 Features

- **Type-Safe Query Building** - Build GraphQL queries with full TypeScript support
- **Modular Architecture** - Composable libraries for different use cases
- **AST-Based Processing** - Work with GraphQL Abstract Syntax Trees
- **Plugin System** - Extend functionality with custom plugins
- **Schema Support** - Validate queries against GraphQL schemas
- **Multiple Presets** - Pre-configured setups for common scenarios
- **Monorepo Structure** - Well-organized, scalable codebase using Nx

## 📦 Packages

### Core Libraries

| Package               | Purpose                              | Status       |
| --------------------- | ------------------------------------ | ------------ |
| `@graphjson/core`     | Core query building and execution    | ✅ Published |
| `@graphjson/ast`      | Abstract Syntax Tree utilities       | ✅ Published |
| `@graphjson/json-dsl` | JSON-based DSL for queries           | ✅ Published |
| `@graphjson/parser`   | GraphQL query parser                 | ✅ Published |
| `@graphjson/printer`  | Query printing and formatting        | ✅ Published |
| `@graphjson/schema`   | Schema validation and utilities      | ✅ Published |
| `@graphjson/sdk`      | High-level SDK for common operations | ✅ Published |
| `@graphjson/plugins`  | Plugin system and built-in plugins   | ✅ Published |
| `@graphjson/presets`  | Pre-configured query presets         | ✅ Published |
| `@graphjson/shared`   | Shared utilities (internal)          | 🔒 Private   |

### CLI

| Package          | Purpose                              |
| ---------------- | ------------------------------------ |
| `@graphjson/cli` | Command-line interface for GraphJSON |

## 🚀 Quick Start

### Installation

```bash
pnpm install @graphjson/core @graphjson/sdk
```

### Basic Usage

```typescript
import { buildQuery } from '@graphjson/core';
import { execute } from '@graphjson/sdk';

// Build a query
const query = buildQuery({
  operation: 'query',
  name: 'GetUser',
  fields: {
    user: {
      args: { id: '123' },
      fields: {
        id: true,
        name: true,
        email: true,
      },
    },
  },
});

// Execute against your GraphQL endpoint
const result = await execute(query, 'https://api.example.com/graphql');
console.log(result);
```

## 📚 Documentation

- [Getting Started Guide](./docs/docs/intro.md)
- [API Documentation](./docs/docs/api/)
- [Tutorial Basics](./docs/docs/tutorial-basics/)
- [Advanced Examples](./examples/)
- [Publishing Guide](./PUBLISHING.md)

## 🏗️ Project Structure

```
graphjson/
├── libs/                          # Core libraries
│   ├── core/                      # Core functionality
│   ├── ast/                       # AST utilities
│   ├── json-dsl/                  # JSON DSL
│   ├── parser/                    # Query parser
│   ├── printer/                   # Query printer
│   ├── schema/                    # Schema validation
│   ├── sdk/                       # High-level SDK
│   ├── plugins/                   # Plugin system
│   ├── presets/                   # Query presets
│   └── shared/                    # Shared utilities (private)
├── apps/
│   └── cli/                       # CLI application
├── examples/                      # Example projects
│   ├── basic/                     # Basic usage
│   ├── advanced/                  # Advanced patterns
│   ├── pagination/                # Pagination examples
│   ├── variables/                 # Query variables
│   └── multilevel/                # Complex queries
├── docs/                          # Documentation site (Docusaurus)
├── nx.json                        # Nx configuration
├── tsconfig.base.json             # TypeScript configuration
└── package.json                   # Root package configuration
```

## 🔧 Development

### Prerequisites

- Node.js 18+
- pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/NexaLeaf/graphjson.git
cd graphjson

# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Run tests
pnpm run test

# Run linting
pnpm run lint

# Format code
pnpm run format
```

### Available Commands

```bash
# Build
pnpm run build              # Build all packages
pnpm run build:watch       # Build in watch mode

# Testing
pnpm run test              # Run all tests
pnpm run test:watch        # Run tests in watch mode
pnpm run test:coverage     # Generate coverage reports

# Code Quality
pnpm run lint              # Lint all packages
pnpm run lint:fix          # Fix linting issues
pnpm run format            # Format code with Prettier
pnpm run format:check      # Check formatting

# Development
pnpm run dev               # Start development mode
pnpm run graph             # Visualize project graph

# Documentation
pnpm run docs:build        # Build documentation site
pnpm run docs:serve        # Serve documentation locally

# Publishing
pnpm run release           # Create a new release (dry-run)
pnpm run release:publish   # Publish packages to npm
```

### Nx Commands

This project uses Nx for task orchestration. Common Nx commands:

```bash
# View project graph
pnpm exec nx graph

# Build specific package
pnpm exec nx build core

# Run tests for affected packages
pnpm exec nx affected -t test

# Run multiple tasks in parallel
pnpm exec nx run-many -t build test lint --parallel=4

# View project details
pnpm exec nx show project core --web
```

## 🏷️ Module Boundaries

This monorepo enforces strict module boundaries using Nx tags:

| Library    | Tag              | Can Import From                        |
| ---------- | ---------------- | -------------------------------------- |
| `core`     | `scope:core`     | `ast`, `json-dsl`, `shared`, `plugins` |
| `ast`      | `scope:ast`      | `json-dsl`                             |
| `json-dsl` | `scope:json-dsl` | `json-dsl` only                        |
| `parser`   | `scope:parser`   | `json-dsl`                             |
| `printer`  | `scope:printer`  | `ast`                                  |
| `schema`   | `scope:schema`   | `json-dsl`, `shared`                   |
| `sdk`      | `scope:sdk`      | `json-dsl`, `core`, `shared`           |
| `plugins`  | `scope:plugins`  | `plugins` only                         |
| `presets`  | `scope:presets`  | `plugins`                              |
| `shared`   | `scope:shared`   | `shared` only                          |

These boundaries are enforced by ESLint and prevent circular dependencies.

## 📖 Examples

### Basic Query

```typescript
import { buildQuery } from '@graphjson/core';

const query = buildQuery({
  operation: 'query',
  fields: {
    users: {
      fields: {
        id: true,
        name: true,
      },
    },
  },
});
```

### With Variables

```typescript
const query = buildQuery({
  operation: 'query',
  variables: {
    userId: 'ID!',
  },
  fields: {
    user: {
      args: { id: '$userId' },
      fields: {
        id: true,
        name: true,
      },
    },
  },
});
```

### Using Presets

```typescript
import { getUserPreset } from '@graphjson/presets';

const query = getUserPreset({ userId: '123' });
```

See the [examples](./examples/) directory for more detailed examples.

## 🧪 Testing

```bash
# Run all tests
pnpm run test

# Run tests for specific package
pnpm exec nx test core

# Run tests in watch mode
pnpm run test:watch

# Generate coverage report
pnpm run test:coverage
```

## 📝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes and commit: `git commit -am 'Add my feature'`
3. Push to the branch: `git push origin feature/my-feature`
4. Submit a Pull Request

### Code Standards

- All code must pass linting: `pnpm run lint`
- All code must be formatted: `pnpm run format`
- All tests must pass: `pnpm run test`
- TypeScript strict mode is enforced
- Module boundaries must be respected

## 🔄 Release Process

This project uses Nx Release for version management and publishing:

```bash
# Preview what will be released
pnpm run release -- --dry-run

# Create a new release
pnpm run release

# Publish to npm
pnpm run release:publish
```

See [PUBLISHING.md](./PUBLISHING.md) for detailed release instructions.

## 📄 License

MIT © 2024 NexaLeaf

## 🤝 Support

- 📖 [Documentation](./docs/)
- 💬 [GitHub Discussions](https://github.com/NexaLeaf/graphjson/discussions)
- 🐛 [Issue Tracker](https://github.com/NexaLeaf/graphjson/issues)

## ☕ Buy Me a Coffee

If you find GraphJSON helpful and would like to support its development, consider buying me a coffee!

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/palanisamy)

Your support helps maintain and improve this project. Thank you! 🙏

## 🔗 Resources

- [GraphQL Official Site](https://graphql.org/)
- [Nx Documentation](https://nx.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Made with ❤️ by NexaLeaf**
