# @graphjson/ast

> AST building utilities for GraphQL field nodes

[![npm version](https://img.shields.io/npm/v/@graphjson/ast)](https://www.npmjs.com/package/@graphjson/ast)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

Low-level AST building utilities for creating GraphQL field nodes from JSON structures. This package is used internally by `@graphjson/core` but can also be used standalone for custom AST manipulation.

## Why Use This?

- 🏗️ **AST Building** - Create GraphQL AST nodes from JSON
- 🔧 **Low-Level Control** - Direct AST manipulation
- 🎯 **Type-Safe** - Full TypeScript support
- ⚡ **Efficient** - Optimized for performance
- 🔌 **Composable** - Use with GraphQL's visit function

## Installation

```bash
npm install @graphjson/ast @graphjson/json-dsl
```

## Quick Start

```typescript
import { buildFieldNode } from '@graphjson/ast';
import type { JsonField } from '@graphjson/json-dsl';

const field: JsonField = {
  args: { id: '123' },
  select: {
    id: true,
    name: true
  }
};

const variables = new Map();
const collectVar = (name, v) => variables.set(name, v);

const fieldNode = buildFieldNode('user', field, collectVar);
```

## API Reference

### `buildFieldNode(name, field, collectVar): FieldNode`

Builds a GraphQL FieldNode from a JSON field definition.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Field name |
| `field` | `JsonField` | JSON field definition |
| `collectVar` | `CollectVar` | Callback for variable collection |

**Returns:** `FieldNode` - GraphQL AST field node

**Example:**

```typescript
const fieldNode = buildFieldNode('users', {
  args: { limit: 10 },
  select: {
    id: true,
    name: true
  }
}, collectVar);
```

## Usage

### Building Simple Fields

```typescript
import { buildFieldNode } from '@graphjson/ast';

const vars = new Map();
const collectVar = (name, v) => vars.set(name, v);

const node = buildFieldNode('user', {
  select: {
    id: true,
    name: true
  }
}, collectVar);

// Result: FieldNode for { id, name }
```

### With Arguments

```typescript
const node = buildFieldNode('users', {
  args: {
    limit: 10,
    offset: 0
  },
  select: {
    id: true,
    name: true
  }
}, collectVar);

// Result: users(limit: 10, offset: 0) { id, name }
```

### With Variables

```typescript
const node = buildFieldNode('user', {
  args: {
    id: { $var: 'userId', type: 'ID!' }
  },
  select: {
    id: true,
    name: true
  }
}, collectVar);

// collectVar will be called with ('userId', { $var: 'userId', type: 'ID!' })
// Result: user(id: $userId) { id, name }
```

### Nested Fields

```typescript
const node = buildFieldNode('user', {
  select: {
    id: true,
    posts: {
      args: { first: 10 },
      select: {
        title: true,
        content: true
      }
    }
  }
}, collectVar);
```

## Advanced Usage

### Custom AST Transformation

```typescript
import { visit, Kind } from 'graphql';
import { buildFieldNode } from '@graphjson/ast';

const fieldNode = buildFieldNode('users', field, collectVar);

// Transform with GraphQL's visit
const transformed = visit(fieldNode, {
  Field(node) {
    // Custom transformation logic
    return modifiedNode;
  }
});
```

### Variable Collection

```typescript
const variables = new Map<string, any>();

const collectVar = (name: string, v: JsonVariable) => {
  variables.set(name, v.default ?? null);
};

buildFieldNode('user', field, collectVar);

// Access collected variables
console.log(Object.fromEntries(variables));
```

## TypeScript Support

```typescript
import type { JsonField } from '@graphjson/json-dsl';
import type { FieldNode } from 'graphql';

function buildCustomField(name: string, field: JsonField): FieldNode {
  const vars = new Map();
  return buildFieldNode(name, field, (n, v) => vars.set(n, v));
}
```

## GraphJSON Ecosystem

| Package | Description | NPM |
|---------|-------------|-----|
| [@graphjson/json-dsl](https://www.npmjs.com/package/@graphjson/json-dsl) | Type definitions | [![npm](https://img.shields.io/npm/v/@graphjson/json-dsl)](https://www.npmjs.com/package/@graphjson/json-dsl) |
| [@graphjson/core](https://www.npmjs.com/package/@graphjson/core) | Core document generation | [![npm](https://img.shields.io/npm/v/@graphjson/core)](https://www.npmjs.com/package/@graphjson/core) |
| [@graphjson/printer](https://www.npmjs.com/package/@graphjson/printer) | Query printer | [![npm](https://img.shields.io/npm/v/@graphjson/printer)](https://www.npmjs.com/package/@graphjson/printer) |

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](https://github.com/NexaLeaf/graphjson/blob/main/CONTRIBUTING.md).

## License

MIT © [NexaLeaf](https://github.com/NexaLeaf)