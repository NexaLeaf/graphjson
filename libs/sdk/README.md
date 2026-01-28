# @graphjson/sdk

> High-level type-safe SDK for building GraphQL queries programmatically

[![npm version](https://img.shields.io/npm/v/@graphjson/sdk)](https://www.npmjs.com/package/@graphjson/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

The GraphJSON SDK provides a fluent, chainable API for building GraphQL queries with full TypeScript support. Build complex queries programmatically with autocomplete and type safety.

## Why Use This?

- 🎯 **Type-Safe** - Full TypeScript support with autocomplete
- ⛓️ **Chainable API** - Fluent, readable query building
- 🚀 **Powerful** - Supports all GraphQL features
- 💡 **IntelliSense** - IDE autocomplete for all methods
- 🔧 **Flexible** - Programmatic query construction

## Installation

```bash
npm install @graphjson/sdk
```

## Quick Start

```typescript
import { query, field, variable } from '@graphjson/sdk';
import { generateDocument } from '@graphjson/core';

const myQuery = query({
  users: field()
    .args({
      limit: variable('limit', 'Int!', 10),
      search: variable('search', 'String'),
    })
    .select({
      id: true,
      name: true,
      email: true,
    }),
});

const { ast, variables } = generateDocument(myQuery);
```

## Features

### 1. Query Builder

Build queries with a fluent API:

```typescript
import { query, field } from '@graphjson/sdk';

const q = query({
  posts: field()
    .args({ first: 20 })
    .select({
      id: true,
      title: true,
      author: field().select({
        name: true,
        avatar: true,
      }),
    }),
});
```

### 2. Field Chaining

Chain methods for complex fields:

```typescript
field()
  .args({ limit: 10 })
  .select({ id: true, name: true })
  .alias('usersList')
  .directive('include', { if: true })
  .paginate('relay');
```

### 3. Variables

Type-safe variable creation:

```typescript
import { variable } from '@graphjson/sdk';

variable('userId', 'ID!'); // Required
variable('limit', 'Int', 10); // With default
variable('filter', 'UserFilterInput'); // Optional
```

### 4. Pagination

Built-in pagination support:

```typescript
field()
  .paginate('relay') // Adds edges/node/pageInfo
  .args({ first: 20 })
  .select({ id: true, title: true });
```

### 5. Where Helpers

Type-safe filter building:

```typescript
import { where, eq, gt, and, or } from '@graphjson/sdk';

const filters = where({
  age: gt(18),
  status: eq('active'),
  role: or(['admin', 'moderator']),
});
```

## API Reference

### `query(fields: Record<string, Field>): JsonDocument`

Creates a query operation.

```typescript
query({
  users: field().select({ id: true }),
  posts: field().select({ title: true }),
});
```

### `mutation(fields: Record<string, Field>): JsonDocument`

Creates a mutation operation.

```typescript
mutation({
  createUser: field()
    .args({ input: variable('user', 'UserInput!') })
    .select({ id: true, name: true }),
});
```

### `field(): FieldBuilder`

Creates a field builder with chainable methods.

**Methods:**

| Method                   | Description         |
| ------------------------ | ------------------- |
| `.args(obj)`             | Add field arguments |
| `.select(obj)`           | Select subfields    |
| `.alias(name)`           | Set field alias     |
| `.directive(name, args)` | Add directive       |
| `.paginate(style)`       | Add pagination      |

### `variable(name: string, type: string, defaultValue?: any): JsonVariable`

Creates a GraphQL variable reference.

```typescript
variable('userId', 'ID!'); // Required variable
variable('limit', 'Int', 10); // With default value
```

## Usage Examples

### Basic Query

```typescript
import { query, field } from '@graphjson/sdk';

const q = query({
  users: field().select({
    id: true,
    name: true,
    email: true,
  }),
});
```

### With Arguments

```typescript
const q = query({
  user: field().args({ id: '123' }).select({
    id: true,
    name: true,
  }),
});
```

### With Variables

```typescript
import { query, field, variable } from '@graphjson/sdk';

const q = query({
  users: field()
    .args({
      limit: variable('pageSize', 'Int!', 20),
      offset: variable('offset', 'Int', 0),
    })
    .select({
      id: true,
      name: true,
    }),
});
```

### Nested Fields

```typescript
const q = query({
  posts: field().select({
    id: true,
    title: true,
    author: field().select({
      id: true,
      name: true,
    }),
    comments: field()
      .args({ first: 10 })
      .select({
        text: true,
        author: field().select({ name: true }),
      }),
  }),
});
```

### With Aliases

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

### With Directives

```typescript
const q = query({
  user: field().select({
    id: true,
    name: true,
    email: field().directive('include', { if: true }),
    phone: field().directive('skip', { if: false }),
  }),
});
```

### Relay Pagination

```typescript
const q = query({
  posts: field().paginate('relay').args({ first: 20 }).select({
    id: true,
    title: true,
    content: true,
  }),
});

// Generates query with edges/node/pageInfo structure
```

### Where Filters

```typescript
import { query, field, where, eq, gt, contains } from '@graphjson/sdk';

const q = query({
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
    }),
});
```

## TypeScript Support

Full type inference and autocomplete:

```typescript
import { query, field } from '@graphjson/sdk';

// TypeScript knows the structure
const q = query({
  users: field()
    .args({
      /* autocomplete works here */
    })
    .select({
      /* and here */
    }),
});
```

## GraphJSON Ecosystem

| Package                                                                  | Description              | NPM                                                                                                           |
| ------------------------------------------------------------------------ | ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| [@graphjson/core](https://www.npmjs.com/package/@graphjson/core)         | Core document generation | [![npm](https://img.shields.io/npm/v/@graphjson/core)](https://www.npmjs.com/package/@graphjson/core)         |
| [@graphjson/json-dsl](https://www.npmjs.com/package/@graphjson/json-dsl) | Type definitions         | [![npm](https://img.shields.io/npm/v/@graphjson/json-dsl)](https://www.npmjs.com/package/@graphjson/json-dsl) |
| [@graphjson/presets](https://www.npmjs.com/package/@graphjson/presets)   | Common presets           | [![npm](https://img.shields.io/npm/v/@graphjson/presets)](https://www.npmjs.com/package/@graphjson/presets)   |

## Examples

See the [examples directory](https://github.com/NexaLeaf/graphjson/tree/main/examples) for complete examples:

- [Advanced Example](https://github.com/NexaLeaf/graphjson/tree/main/examples/advanced) - Complete SDK showcase

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](https://github.com/NexaLeaf/graphjson/blob/main/CONTRIBUTING.md).

## License

MIT © [NexaLeaf](https://github.com/NexaLeaf)
