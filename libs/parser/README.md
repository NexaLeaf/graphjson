# @graphjson/parser

> Complete GraphJSON library - All GraphJSON packages in one convenient import

[![npm version](https://img.shields.io/npm/v/@graphjson/parser)](https://www.npmjs.com/package/@graphjson/parser)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

GraphJSON Parser is a unified package that bundles all GraphJSON libraries, providing everything you need to transform JSON queries into executable GraphQL documents with variables, plugins, and type safety.

## Why Use This?

✅ **All-in-One Package** - One install instead of nine  
✅ **Complete Toolkit** - Core, SDK, Schema, AST, Plugins, Presets, and more  
✅ **Type-Safe** - Full TypeScript support with autocomplete  
✅ **Version Consistency** - All packages stay in sync  
✅ **Easy Imports** - Import everything from a single package

## Installation

```bash
npm install @graphjson/parser
```

## What's Included

This package includes all GraphJSON libraries:

| Package                 | Description                             | Size    |
| ----------------------- | --------------------------------------- | ------- |
| **@graphjson/core**     | Core document generation engine         | Core    |
| **@graphjson/sdk**      | Type-safe query builder with fluent API | SDK     |
| **@graphjson/schema**   | JSON schema validation                  | Schema  |
| **@graphjson/ast**      | AST building utilities                  | AST     |
| **@graphjson/json-dsl** | JSON DSL type definitions               | Types   |
| **@graphjson/plugins**  | Plugin system for transformations       | Plugins |
| **@graphjson/presets**  | Common presets (Relay pagination, etc.) | Presets |
| **@graphjson/printer**  | Query string printer utilities          | Printer |
| **@graphjson/shared**   | Shared utilities                        | Utils   |

## Quick Start

### Basic Usage

```typescript
import { generateDocument } from '@graphjson/parser';
import { print } from 'graphql';

const { ast, variables } = generateDocument({
  query: {
    users: {
      args: {
        limit: { $var: 'limit', type: 'Int!', default: 10 },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  },
});

console.log(print(ast));
// query($limit: Int!) {
//   users(limit: $limit) {
//     id
//     name
//     email
//   }
// }

console.log(variables); // { limit: 10 }
```

### Using the SDK

```typescript
import { query, field, variable } from '@graphjson/parser';

const myQuery = query({
  users: field()
    .args({
      limit: variable('limit', 'Int!', 20),
      search: variable('search', 'String'),
    })
    .select({
      id: true,
      name: true,
      email: true,
    }),
});
```

### With Schema Validation

```typescript
import { generateDocument, validateDocument } from '@graphjson/parser';

const jsonQuery = {
  query: {
    users: {
      select: { id: true, name: true },
    },
  },
};

// Validate before generating
const validation = validateDocument(jsonQuery);
if (validation.valid) {
  const { ast, variables } = generateDocument(jsonQuery);
}
```

## Core Features

### 1. Document Generation

Transform JSON to GraphQL DocumentNode:

```typescript
import { generateDocument } from '@graphjson/parser';

const { ast, variables } = generateDocument({
  query: {
    posts: {
      args: { first: 10 },
      select: {
        id: true,
        title: true,
        content: true,
      },
    },
  },
});
```

**Supports:**

- Query, Mutation, and Subscription operations
- Nested field selections
- Arguments and variables
- Multiple root fields
- Aliases and directives

### 2. Type-Safe SDK

Build queries programmatically with chainable API:

```typescript
import { query, field, variable, where, eq, gt } from '@graphjson/parser';

const myQuery = query({
  users: field()
    .args({
      limit: variable('limit', 'Int!', 20),
      where: where({
        age: gt(18),
        status: eq('active'),
      }),
    })
    .select({
      id: true,
      name: true,
      email: true,
    }),
});
```

**SDK Methods:**

- `query()` - Create query operation
- `mutation()` - Create mutation operation
- `field()` - Create field builder
- `variable()` - Create GraphQL variable
- `where()` - Build filter expressions
- `eq()`, `gt()`, `lt()`, `contains()` - Comparison operators
- `and()`, `or()`, `not()` - Logical operators

### 3. Plugin System

Transform documents with reusable plugins:

```typescript
import { generateDocument, applyPlugins, relayPaginationPreset } from '@graphjson/parser';

const { ast } = generateDocument({
  query: {
    posts: {
      args: { first: 20 },
      select: { id: true, title: true },
    },
  },
});

// Apply Relay pagination
const relayQuery = applyPlugins(ast, [relayPaginationPreset()]);
```

**Built-in Presets:**

- `relayPaginationPreset()` - Relay-style cursor pagination with edges/pageInfo

### 4. Schema Validation

Validate JSON queries before generation:

```typescript
import { validateDocument } from '@graphjson/parser';

const validation = validateDocument({
  query: {
    users: {
      select: { id: true, name: true },
    },
  },
});

if (validation.valid) {
  console.log('✓ Valid query');
} else {
  console.error('Errors:', validation.errors);
}
```

### 5. Variable Management

Automatic variable extraction and management:

```typescript
const { ast, variables } = generateDocument({
  query: {
    user: {
      args: {
        id: { $var: 'userId', type: 'ID!', default: '123' },
        includeDeleted: { $var: 'showDeleted', type: 'Boolean', default: false },
      },
      select: { id: true, name: true },
    },
  },
});

// Variables auto-extracted
console.log(variables); // { userId: '123', showDeleted: false }
```

## Complete Examples

### Example 1: Simple Query

```typescript
import { query, field } from '@graphjson/parser';
import { generateDocument } from '@graphjson/parser';

const myQuery = query({
  users: field().select({
    id: true,
    name: true,
    email: true,
  }),
});

const { ast } = generateDocument(myQuery);
```

Generates:

```graphql
query {
  users {
    id
    name
    email
  }
}
```

### Example 2: With Variables

```typescript
import { query, field, variable } from '@graphjson/parser';

const myQuery = query({
  users: field()
    .args({
      limit: variable('limit', 'Int!', 10),
      offset: variable('offset', 'Int', 0),
    })
    .select({
      id: true,
      name: true,
    }),
});

const { ast, variables } = generateDocument(myQuery);
```

Generates:

```graphql
query ($limit: Int!, $offset: Int) {
  users(limit: $limit, offset: $offset) {
    id
    name
  }
}
```

### Example 3: Nested Queries

```typescript
const myQuery = query({
  companies: field()
    .args({ first: 5 })
    .select({
      id: true,
      name: true,
      departments: field()
        .args({ first: 3 })
        .select({
          id: true,
          name: true,
          employees: field().args({ first: 10 }).select({
            id: true,
            firstName: true,
            lastName: true,
          }),
        }),
    }),
});
```

### Example 4: Relay Pagination

```typescript
import { query, field, variable, applyPlugins, relayPaginationPreset } from '@graphjson/parser';

const myQuery = query({
  posts: field()
    .args({
      first: variable('first', 'Int', 20),
      after: variable('after', 'String'),
    })
    .select({
      id: true,
      title: true,
      content: true,
    }),
});

const { ast } = generateDocument(myQuery);
const relayQuery = applyPlugins(ast, [relayPaginationPreset()]);
```

Generates Relay-style query with `edges`, `node`, and `pageInfo`.

### Example 5: Where Filters

```typescript
import { query, field, where, eq, gt, contains, and } from '@graphjson/parser';

const myQuery = query({
  users: field()
    .args({
      where: where({
        age: gt(18),
        status: eq('active'),
        name: contains('john'),
      }),
    })
    .select({
      id: true,
      name: true,
      age: true,
    }),
});
```

### Example 6: Mutations

```typescript
import { mutation, field, variable } from '@graphjson/parser';

const createUser = mutation({
  createUser: field()
    .args({
      input: variable('userInput', 'UserInput!'),
    })
    .select({
      id: true,
      name: true,
      email: true,
      createdAt: true,
    }),
});
```

### Example 7: Multiple Operations

```typescript
const myQuery = {
  query: {
    users: field().select({ id: true, name: true }),
  },
  mutation: {
    updateUser: field()
      .args({ id: variable('userId', 'ID!') })
      .select({ id: true, name: true }),
  },
};

const { ast, variables } = generateDocument(myQuery);
```

## Integration with GraphQL Clients

### Apollo Client

```typescript
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { query, field, generateDocument } from '@graphjson/parser';

const client = new ApolloClient({
  uri: 'https://api.example.com/graphql',
  cache: new InMemoryCache(),
});

const myQuery = query({
  users: field().select({ id: true, name: true }),
});

const { ast, variables } = generateDocument(myQuery);

const result = await client.query({
  query: ast,
  variables,
});
```

### urql

```typescript
import { createClient } from 'urql';
import { query, field, generateDocument } from '@graphjson/parser';

const client = createClient({
  url: 'https://api.example.com/graphql',
});

const myQuery = query({
  posts: field().select({ id: true, title: true }),
});

const { ast, variables } = generateDocument(myQuery);
const result = await client.query(ast, variables).toPromise();
```

### graphql-request

```typescript
import { GraphQLClient } from 'graphql-request';
import { query, field, generateDocument } from '@graphjson/parser';

const client = new GraphQLClient('https://api.example.com/graphql');

const myQuery = query({
  users: field().select({ id: true, name: true }),
});

const { ast, variables } = generateDocument(myQuery);
const result = await client.request(ast, variables);
```

## TypeScript Support

Full TypeScript support with type inference:

```typescript
import type {
  JsonDocument,
  JsonField,
  JsonVariable,
  GenerateResult,
  GraphJsonPlugin,
} from '@graphjson/parser';

const query: JsonDocument = {
  query: {
    users: {
      select: { id: true, name: true },
    },
  },
};
```

## API Reference

### Core API

#### `generateDocument(json: JsonDocument): GenerateResult`

Generates GraphQL document from JSON definition.

**Returns:**

```typescript
{
  ast: DocumentNode,        // GraphQL AST
  variables: Record<string, any>  // Extracted variables
}
```

#### `applyPlugins(doc: DocumentNode, plugins: GraphJsonPlugin[]): DocumentNode`

Applies transformation plugins to document.

### SDK API

#### `query(fields: Record<string, Field>): JsonDocument`

Creates query operation.

#### `mutation(fields: Record<string, Field>): JsonDocument`

Creates mutation operation.

#### `field(): FieldBuilder`

Creates field builder with methods:

- `.args(obj)` - Add arguments
- `.select(obj)` - Select subfields
- `.alias(name)` - Set alias
- `.directive(name, args)` - Add directive
- `.paginate(style)` - Add pagination

#### `variable(name: string, type: string, defaultValue?: any): JsonVariable`

Creates GraphQL variable reference.

#### Filter Operators

- `eq(value)` - Equals
- `ne(value)` - Not equals
- `gt(value)` - Greater than
- `gte(value)` - Greater than or equal
- `lt(value)` - Less than
- `lte(value)` - Less than or equal
- `contains(value)` - Contains string
- `startsWith(value)` - Starts with string
- `endsWith(value)` - Ends with string
- `in(values)` - In array
- `notIn(values)` - Not in array

#### Logical Operators

- `and(conditions)` - AND conditions
- `or(conditions)` - OR conditions
- `not(condition)` - NOT condition

### Schema API

#### `validateDocument(json: JsonDocument): ValidationResult`

Validates JSON query structure.

**Returns:**

```typescript
{
  valid: boolean,
  errors?: Array<{
    message: string,
    path: string[]
  }>
}
```

### Presets API

#### `relayPaginationPreset(): GraphJsonPlugin`

Relay-style pagination preset that adds:

- `edges { node { ... } cursor }`
- `pageInfo { hasNextPage, hasPreviousPage, startCursor, endCursor }`

## Complete Usage Examples

### Example: Full Featured Query

```typescript
import {
  query,
  field,
  variable,
  where,
  eq,
  gt,
  contains,
  generateDocument,
  validateDocument,
  applyPlugins,
  relayPaginationPreset,
} from '@graphjson/parser';

// Build query with SDK
const myQuery = query({
  posts: field()
    .args({
      first: variable('first', 'Int', 20),
      after: variable('after', 'String'),
      where: where({
        status: eq('published'),
        views: gt(100),
        title: contains('GraphQL'),
      }),
    })
    .paginate('relay')
    .select({
      id: true,
      title: true,
      content: true,
      author: field().select({
        id: true,
        name: true,
        avatar: true,
      }),
      tags: field().select({
        name: true,
      }),
    }),
});

// Validate
const validation = validateDocument(myQuery);
if (!validation.valid) {
  console.error('Invalid query:', validation.errors);
  return;
}

// Generate document
const { ast, variables } = generateDocument(myQuery);

// Apply Relay pagination
const relayAst = applyPlugins(ast, [relayPaginationPreset()]);

// Use with GraphQL client
const result = await client.query(relayAst, variables);
```

### Example: CRUD Operations

```typescript
import { query, mutation, field, variable, generateDocument } from '@graphjson/parser';

// READ
const getUsers = query({
  users: field()
    .args({ limit: variable('limit', 'Int', 10) })
    .select({ id: true, name: true, email: true }),
});

// CREATE
const createUser = mutation({
  createUser: field()
    .args({ input: variable('input', 'UserInput!') })
    .select({ id: true, name: true, email: true, createdAt: true }),
});

// UPDATE
const updateUser = mutation({
  updateUser: field()
    .args({
      id: variable('userId', 'ID!'),
      input: variable('updates', 'UserUpdateInput!'),
    })
    .select({ id: true, name: true, updatedAt: true }),
});

// DELETE
const deleteUser = mutation({
  deleteUser: field()
    .args({ id: variable('userId', 'ID!') })
    .select({ success: true, message: true }),
});
```

### Example: Complex Nested Query

```typescript
import { query, field, variable } from '@graphjson/parser';

const complexQuery = query({
  organization: field()
    .args({ id: variable('orgId', 'ID!') })
    .select({
      id: true,
      name: true,
      departments: field()
        .args({ first: 10 })
        .select({
          id: true,
          name: true,
          manager: field().select({
            id: true,
            name: true,
            email: true,
          }),
          employees: field()
            .args({
              first: 20,
              orderBy: 'NAME_ASC',
            })
            .select({
              id: true,
              firstName: true,
              lastName: true,
              position: true,
              projects: field().select({
                id: true,
                title: true,
                deadline: true,
              }),
            }),
        }),
    }),
});
```

## Advanced Features

### Custom Plugins

Create your own transformation plugins:

```typescript
import type { GraphJsonPlugin } from '@graphjson/parser';
import { visit } from 'graphql';

const customPlugin: GraphJsonPlugin = {
  name: 'my-custom-plugin',
  transform: (document) => {
    return visit(document, {
      Field(node) {
        // Transform field node
        return node;
      },
    });
  },
};

const transformed = applyPlugins(ast, [customPlugin]);
```

### Conditional Fields

```typescript
const q = query({
  user: field().select({
    id: true,
    name: true,
    email: field().directive('include', { if: variable('includeEmail', 'Boolean', true) }),
    phone: field().directive('skip', { if: variable('skipPhone', 'Boolean', false) }),
  }),
});
```

### Field Aliases

```typescript
const q = query({
  recentPosts: field()
    .alias('recent')
    .args({ first: 10, orderBy: 'CREATED_DESC' })
    .select({ id: true, title: true }),

  popularPosts: field()
    .alias('popular')
    .args({ first: 10, orderBy: 'VIEWS_DESC' })
    .select({ id: true, title: true }),
});
```

## Individual Package Usage

While @graphjson/parser provides everything, you can also install individual packages if you only need specific functionality:

```bash
# Just the core
npm install @graphjson/core

# Just the SDK
npm install @graphjson/sdk

# Just schema validation
npm install @graphjson/schema
```

## Benefits

### All-in-One Installation

**Before:**

```bash
npm install @graphjson/core @graphjson/sdk @graphjson/schema @graphjson/ast @graphjson/json-dsl @graphjson/plugins @graphjson/presets @graphjson/printer @graphjson/shared
```

**Now:**

```bash
npm install @graphjson/parser
```

### Unified Imports

**Before:**

```typescript
import { generateDocument } from '@graphjson/core';
import { query, field, variable } from '@graphjson/sdk';
import { validateDocument } from '@graphjson/schema';
import { relayPaginationPreset } from '@graphjson/presets';
```

**Now:**

```typescript
import {
  generateDocument,
  query,
  field,
  variable,
  validateDocument,
  relayPaginationPreset,
} from '@graphjson/parser';
```

### Version Consistency

All packages are guaranteed to be compatible versions when installed together.

## TypeScript Types

All types are fully exported:

```typescript
import type {
  // Core types
  JsonDocument,
  JsonField,
  JsonVariable,
  JsonValue,
  GenerateResult,

  // Plugin types
  GraphJsonPlugin,
  PluginContext,

  // SDK types
  FieldBuilder,
  WhereCondition,
  FilterOperator,

  // Schema types
  ValidationResult,
  ValidationError,
} from '@graphjson/parser';
```

## Package Contents

| Export Category | Exports                                                                                   |
| --------------- | ----------------------------------------------------------------------------------------- |
| **Core**        | `generateDocument`, `applyPlugins`                                                        |
| **SDK**         | `query`, `mutation`, `field`, `variable`, `where`                                         |
| **Operators**   | `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `notIn`, `contains`, `startsWith`, `endsWith` |
| **Logical**     | `and`, `or`, `not`                                                                        |
| **Schema**      | `validateDocument`                                                                        |
| **Presets**     | `relayPaginationPreset`                                                                   |
| **Types**       | All TypeScript types and interfaces                                                       |

## Examples Repository

Check out complete working examples:

- [Basic](https://github.com/NexaLeaf/graphjson/tree/main/examples/basic) - Simple query generation
- [Variables](https://github.com/NexaLeaf/graphjson/tree/main/examples/variables) - Using GraphQL variables
- [Multilevel](https://github.com/NexaLeaf/graphjson/tree/main/examples/multilevel) - Nested queries
- [Advanced](https://github.com/NexaLeaf/graphjson/tree/main/examples/advanced) - SDK with all features
- [Pagination](https://github.com/NexaLeaf/graphjson/tree/main/examples/pagination) - Cursor-based pagination

## Documentation

- 📖 [Full Documentation](https://github.com/NexaLeaf/graphjson#readme)
- 🎯 [Core Package](https://www.npmjs.com/package/@graphjson/core)
- 🛠️ [SDK Package](https://www.npmjs.com/package/@graphjson/sdk)
- ✅ [Schema Package](https://www.npmjs.com/package/@graphjson/schema)

## Contributing

Contributions are welcome! Please see our [Contributing Guide](https://github.com/NexaLeaf/graphjson/blob/main/CONTRIBUTING.md).

## License

MIT © [NexaLeaf](https://github.com/NexaLeaf)

## Support

- 🐛 [Issue Tracker](https://github.com/NexaLeaf/graphjson/issues)
- 💬 [Discussions](https://github.com/NexaLeaf/graphjson/discussions)
- 📦 [NPM Packages](https://www.npmjs.com/org/graphjson)
- 🌐 [GitHub](https://github.com/NexaLeaf/graphjson)
