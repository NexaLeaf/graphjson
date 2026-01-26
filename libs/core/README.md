# @graphjson/core

> Transform JSON queries into GraphQL documents with variables and plugins

[![npm version](https://img.shields.io/npm/v/@graphjson/core)](https://www.npmjs.com/package/@graphjson/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

GraphJSON Core is the heart of the GraphJSON ecosystem, providing tools to convert JSON-based query definitions into executable GraphQL documents with full variable support and extensibility through plugins.

## Why Use This?

- 📝 **Write GraphQL queries in JSON format** - More structured and easier to manipulate
- 🔄 **Automatic variable extraction** - Variables are managed for you
- 🎨 **Extensible plugin system** - Transform queries with custom logic
- 🎯 **Full TypeScript support** - Complete type safety
- 🚀 **Zero runtime dependencies** - Lightweight and fast

## Installation

```bash
npm install @graphjson/core @graphjson/json-dsl
```

## Quick Start

```typescript
import { generateDocument } from '@graphjson/core';
import { print } from 'graphql';

const { ast, variables } = generateDocument({
  query: {
    users: {
      args: {
        limit: { $var: 'limit', type: 'Int!', default: 10 }
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    }
  }
});

// Print the generated GraphQL query
console.log(print(ast));
// Output:
// query($limit: Int!) {
//   users(limit: $limit) {
//     id
//     name
//     email
//   }
// }

console.log(variables);
// Output: { limit: 10 }
```

## Features

### 1. Document Generation

Convert JSON to GraphQL DocumentNode:

```typescript
const { ast, variables } = generateDocument({
  query: { /* ... */ },
  mutation: { /* ... */ },
  subscription: { /* ... */ }
});
```

**Supports:**
- Query, Mutation, and Subscription operations
- Nested field selections
- Arguments and variables
- Multiple root fields

### 2. Variable Management

Variables are automatically extracted and managed:

```typescript
const result = generateDocument({
  query: {
    user: {
      args: {
        id: { $var: 'userId', type: 'ID!', default: '123' }
      },
      select: {
        id: true,
        name: true
      }
    }
  }
});

// Variables extracted automatically
console.log(result.variables); // { userId: '123' }
```

**Variable Features:**
- Automatic extraction from `$var` syntax
- Type definitions (ID!, String, Int, Boolean, etc.)
- Default values
- Proper GraphQL variable declarations

### 3. Plugin System

Transform documents with reusable plugins:

```typescript
import { applyPlugins } from '@graphjson/core';
import { relayPagination } from '@graphjson/presets';

const transformed = applyPlugins(document, [
  relayPagination(),
  customPlugin()
]);
```

**Plugin Capabilities:**
- Transform entire document
- Modify individual fields
- Add pagination structures
- Inject directives
- Custom query transformations

## API Reference

### `generateDocument(json: JsonDocument): GenerateResult`

Generates a GraphQL document from JSON definition.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `json` | `JsonDocument` | JSON query definition with query/mutation/subscription |

**Returns:** `GenerateResult` object containing:

| Property | Type | Description |
|----------|------|-------------|
| `ast` | `DocumentNode` | GraphQL AST (use with GraphQL clients) |
| `variables` | `Record<string, any>` | Extracted variable values |

**Example:**

```typescript
const { ast, variables } = generateDocument({
  query: {
    posts: {
      args: { first: 10 },
      select: {
        id: true,
        title: true
      }
    }
  }
});
```

### `applyPlugins(document: DocumentNode, plugins: GraphJsonPlugin[]): DocumentNode`

Applies transformation plugins to a GraphQL document.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `document` | `DocumentNode` | GraphQL AST to transform |
| `plugins` | `GraphJsonPlugin[]` | Array of plugins to apply |

**Returns:** `DocumentNode` - Transformed GraphQL AST

**Example:**

```typescript
import { applyPlugins } from '@graphjson/core';
import { relayPagination } from '@graphjson/presets';

const transformed = applyPlugins(document, [
  relayPagination()
]);
```

## Usage Examples

### Basic Query

```typescript
import { generateDocument } from '@graphjson/core';

const { ast, variables } = generateDocument({
  query: {
    users: {
      select: {
        id: true,
        name: true
      }
    }
  }
});
```

### With Variables

```typescript
const { ast, variables } = generateDocument({
  query: {
    user: {
      args: {
        id: { $var: 'userId', type: 'ID!' }
      },
      select: {
        id: true,
        email: true
      }
    }
  }
});

// Use with GraphQL client
const result = await client.request(ast, {
  ...variables,
  userId: 'user-123'  // Override variable
});
```

### Nested Queries

```typescript
const { ast, variables } = generateDocument({
  query: {
    companies: {
      args: { first: 5 },
      select: {
        id: true,
        name: true,
        departments: {
          args: { first: 3 },
          select: {
            id: true,
            name: true,
            employees: {
              args: { first: 10 },
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    }
  }
});
```

### Multiple Operations

```typescript
const { ast, variables } = generateDocument({
  query: {
    users: {
      select: { id: true, name: true }
    }
  },
  mutation: {
    createUser: {
      args: {
        input: { $var: 'userInput', type: 'UserInput!' }
      },
      select: {
        id: true,
        name: true
      }
    }
  }
});
```

### With Plugins

```typescript
import { generateDocument, applyPlugins } from '@graphjson/core';
import { relayPagination } from '@graphjson/presets';

// Generate base document
const { ast } = generateDocument({
  query: {
    posts: {
      args: { first: 20 },
      select: {
        id: true,
        title: true
      }
    }
  }
});

// Apply Relay pagination transformation
const relayQuery = applyPlugins(ast, [relayPagination()]);

// Result automatically includes edges/pageInfo structure
```

## TypeScript Support

Full TypeScript definitions included for type-safe development.

### Import Types

```typescript
import type {
  JsonDocument,
  JsonField,
  JsonVariable,
  GenerateResult
} from '@graphjson/core';
```

### Type Definitions

```typescript
interface JsonDocument {
  query?: Record<string, JsonField>;
  mutation?: Record<string, JsonField>;
  subscription?: Record<string, JsonField>;
}

interface JsonField {
  args?: Record<string, JsonValue | JsonVariable>;
  select?: Record<string, boolean | JsonField>;
}

interface JsonVariable {
  $var: string;
  type: string;
  default?: any;
}

interface GenerateResult {
  ast: DocumentNode;
  variables: Record<string, any>;
}
```

### Usage with Types

```typescript
import type { JsonDocument } from '@graphjson/core';
import { generateDocument } from '@graphjson/core';

const query: JsonDocument = {
  query: {
    users: {
      args: {
        limit: { $var: 'limit', type: 'Int!', default: 10 }
      },
      select: {
        id: true,
        name: true
      }
    }
  }
};

const result = generateDocument(query);
```

## Integration with GraphQL Clients

### Apollo Client

```typescript
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { generateDocument } from '@graphjson/core';

const client = new ApolloClient({
  uri: 'https://api.example.com/graphql',
  cache: new InMemoryCache()
});

const { ast, variables } = generateDocument(myQuery);

const result = await client.query({
  query: ast,
  variables
});
```

### urql

```typescript
import { createClient } from 'urql';
import { generateDocument } from '@graphjson/core';

const client = createClient({
  url: 'https://api.example.com/graphql'
});

const { ast, variables } = generateDocument(myQuery);

const result = await client.query(ast, variables).toPromise();
```

### graphql-request

```typescript
import { GraphQLClient } from 'graphql-request';
import { generateDocument } from '@graphjson/core';

const client = new GraphQLClient('https://api.example.com/graphql');

const { ast, variables } = generateDocument(myQuery);

const result = await client.request(ast, variables);
```

## Examples

### Basic Example

```typescript
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
```

Generates:
```graphql
query {
  users {
    id
    name
  }
}
```

### With Arguments

```typescript
const { ast } = generateDocument({
  query: {
    user: {
      args: { id: "123" },
      select: {
        id: true,
        name: true
      }
    }
  }
});
```

Generates:
```graphql
query {
  user(id: "123") {
    id
    name
  }
}
```

### With Variables

```typescript
const { ast, variables } = generateDocument({
  query: {
    users: {
      args: {
        limit: { $var: 'pageSize', type: 'Int!', default: 20 },
        offset: { $var: 'offset', type: 'Int', default: 0 }
      },
      select: {
        id: true,
        name: true
      }
    }
  }
});
```

Generates:
```graphql
query($pageSize: Int!, $offset: Int) {
  users(limit: $pageSize, offset: $offset) {
    id
    name
  }
}
```

With variables:
```json
{
  "pageSize": 20,
  "offset": 0
}
```

## GraphJSON Ecosystem

This package is part of the GraphJSON ecosystem:

| Package | Description | NPM |
|---------|-------------|-----|
| [@graphjson/json-dsl](https://github.com/NexaLeaf/graphjson/tree/main/libs/json-dsl) | JSON DSL type definitions | [![npm](https://img.shields.io/npm/v/@graphjson/json-dsl)](https://www.npmjs.com/package/@graphjson/json-dsl) |
| [@graphjson/ast](https://github.com/NexaLeaf/graphjson/tree/main/libs/ast) | AST building utilities | [![npm](https://img.shields.io/npm/v/@graphjson/ast)](https://www.npmjs.com/package/@graphjson/ast) |
| [@graphjson/printer](https://github.com/NexaLeaf/graphjson/tree/main/libs/printer) | Query string printer | [![npm](https://img.shields.io/npm/v/@graphjson/printer)](https://www.npmjs.com/package/@graphjson/printer) |
| [@graphjson/plugins](https://github.com/NexaLeaf/graphjson/tree/main/libs/plugins) | Plugin system types | [![npm](https://img.shields.io/npm/v/@graphjson/plugins)](https://www.npmjs.com/package/@graphjson/plugins) |
| [@graphjson/presets](https://github.com/NexaLeaf/graphjson/tree/main/libs/presets) | Common presets (Relay, etc.) | [![npm](https://img.shields.io/npm/v/@graphjson/presets)](https://www.npmjs.com/package/@graphjson/presets) |
| [@graphjson/sdk](https://github.com/NexaLeaf/graphjson/tree/main/libs/sdk) | High-level type-safe SDK | [![npm](https://img.shields.io/npm/v/@graphjson/sdk)](https://www.npmjs.com/package/@graphjson/sdk) |
| [@graphjson/schema](https://github.com/NexaLeaf/graphjson/tree/main/libs/schema) | Schema validation | [![npm](https://img.shields.io/npm/v/@graphjson/schema)](https://www.npmjs.com/package/@graphjson/schema) |

## Examples

Check out the [examples directory](https://github.com/NexaLeaf/graphjson/tree/main/examples) for complete working examples:

- [Basic](https://github.com/NexaLeaf/graphjson/tree/main/examples/basic) - Simple query generation
- [Variables](https://github.com/NexaLeaf/graphjson/tree/main/examples/variables) - Using GraphQL variables
- [Multilevel](https://github.com/NexaLeaf/graphjson/tree/main/examples/multilevel) - Nested queries
- [Advanced](https://github.com/NexaLeaf/graphjson/tree/main/examples/advanced) - SDK with all features
- [Pagination](https://github.com/NexaLeaf/graphjson/tree/main/examples/pagination) - Cursor-based pagination

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](https://github.com/NexaLeaf/graphjson/blob/main/CONTRIBUTING.md) for guidelines.

## License

MIT © [NexaLeaf](https://github.com/NexaLeaf)

## Support

- 📖 [Documentation](https://github.com/NexaLeaf/graphjson#readme)
- 🐛 [Issue Tracker](https://github.com/NexaLeaf/graphjson/issues)
- 💬 [Discussions](https://github.com/NexaLeaf/graphjson/discussions)
- 📦 [NPM Package](https://www.npmjs.com/package/@graphjson/core)