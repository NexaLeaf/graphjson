# @graphjson/printer

> Print GraphQL queries as formatted strings

[![npm version](https://img.shields.io/npm/v/@graphjson/printer)](https://www.npmjs.com/package/@graphjson/printer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

GraphJSON Printer provides utilities for converting GraphQL AST nodes back into formatted query strings.

## Why Use This?

- 📄 **Pretty Printing** - Format GraphQL queries beautifully
- 🎨 **Customizable** - Control formatting options
- 🔧 **AST-Based** - Works with GraphQL AST nodes
- 🚀 **Fast** - Optimized printing algorithm
- 📦 **Lightweight** - Minimal dependencies

## Installation

```bash
npm install @graphjson/printer
```

## Quick Start

```typescript
import { print } from 'graphql';
import { generateDocument } from '@graphjson/core';

const { ast } = generateDocument({
  query: {
    users: {
      select: {
        id: true,
        name: true
      }
    }
  }
});

// Print the query
console.log(print(ast));
```

**Output:**
```graphql
query {
  users {
    id
    name
  }
}
```

## Usage

The printer is based on GraphQL's built-in `print` function and works with any GraphQL DocumentNode or AST node.

### Basic Printing

```typescript
import { print } from 'graphql';

const queryString = print(ast);
```

### With Formatting

```typescript
import { print } from 'graphql';

const formatted = print(ast);

// Result is automatically formatted with:
// - Proper indentation
// - Consistent spacing
// - Readable structure
```

## GraphJSON Ecosystem

| Package | Description | NPM |
|---------|-------------|-----|
| [@graphjson/core](https://www.npmjs.com/package/@graphjson/core) | Core document generation | [![npm](https://img.shields.io/npm/v/@graphjson/core)](https://www.npmjs.com/package/@graphjson/core) |
| [@graphjson/ast](https://www.npmjs.com/package/@graphjson/ast) | AST building utilities | [![npm](https://img.shields.io/npm/v/@graphjson/ast)](https://www.npmjs.com/package/@graphjson/ast) |

## Examples

See the [examples directory](https://github.com/NexaLeaf/graphjson/tree/main/examples) for usage examples.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](https://github.com/NexaLeaf/graphjson/blob/main/CONTRIBUTING.md).

## License

MIT © [NexaLeaf](https://github.com/NexaLeaf)