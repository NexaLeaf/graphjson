# @graphjson/json-dsl

> TypeScript type definitions for the GraphJSON JSON DSL

[![npm version](https://img.shields.io/npm/v/@graphjson/json-dsl)](https://www.npmjs.com/package/@graphjson/json-dsl)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

Type definitions and interfaces for the GraphJSON JSON Domain Specific Language (DSL). This package provides TypeScript types for writing type-safe JSON-based GraphQL queries.

## Why Use This?

- 🎯 **Full Type Safety** - TypeScript definitions for all JSON query structures
- 📝 **IDE Autocomplete** - IntelliSense support for query building
- ✅ **Compile-Time Validation** - Catch errors before runtime
- 📚 **Self-Documenting** - Types serve as documentation
- 🔧 **Foundation** - Core types used across GraphJSON ecosystem

## Installation

```bash
npm install @graphjson/json-dsl
```

## Quick Start

```typescript
import type { JsonDocument, JsonField, JsonVariable } from '@graphjson/json-dsl';

const query: JsonDocument = {
  query: {
    users: {
      args: {
        limit: { $var: 'limit', type: 'Int!', default: 10 },
      },
      select: {
        id: true,
        name: true,
      },
    },
  },
};
```

## Type Definitions

### `JsonDocument`

Root type for a GraphJSON document.

```typescript
interface JsonDocument {
  query?: Record<string, JsonField>;
  mutation?: Record<string, JsonField>;
  subscription?: Record<string, JsonField>;
}
```

**Example:**

```typescript
const doc: JsonDocument = {
  query: {
    users: { select: { id: true } },
  },
  mutation: {
    createUser: {
      args: { input: { $var: 'user', type: 'UserInput!' } },
      select: { id: true },
    },
  },
};
```

### `JsonField`

Represents a field with optional arguments and subfield selection.

```typescript
interface JsonField {
  args?: Record<string, JsonValue | JsonVariable>;
  select?: Record<string, boolean | JsonField>;
}
```

**Example:**

```typescript
const userField: JsonField = {
  args: { id: '123' },
  select: {
    id: true,
    name: true,
    posts: {
      args: { first: 10 },
      select: {
        title: true,
      },
    },
  },
};
```

### `JsonVariable`

Represents a GraphQL variable reference.

```typescript
interface JsonVariable {
  $var: string; // Variable name
  type: string; // GraphQL type
  default?: any; // Optional default value
}
```

**Example:**

```typescript
const idVar: JsonVariable = {
  $var: 'userId',
  type: 'ID!',
  default: '123',
};
```

### `JsonValue`

Union type for all possible JSON values.

```typescript
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
```

## Usage Examples

### Type-Safe Query Building

```typescript
import type { JsonDocument } from '@graphjson/json-dsl';

const query: JsonDocument = {
  query: {
    users: {
      select: {
        id: true,
        name: true,
        // TypeScript will error if you use invalid structure
      },
    },
  },
};
```

### Field Definition

```typescript
import type { JsonField } from '@graphjson/json-dsl';

function createUserQuery(userId: string): JsonField {
  return {
    args: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  };
}
```

### Variable Helper

```typescript
import type { JsonVariable } from '@graphjson/json-dsl';

function createVariable(name: string, type: string, defaultValue?: any): JsonVariable {
  return {
    $var: name,
    type,
    ...(defaultValue !== undefined && { default: defaultValue }),
  };
}

// Usage
const pageSize = createVariable('pageSize', 'Int!', 20);
```

### Type Guards

```typescript
import type { JsonVariable } from '@graphjson/json-dsl';

function isJsonVariable(value: any): value is JsonVariable {
  return (
    typeof value === 'object' &&
    value !== null &&
    '$var' in value &&
    typeof value.$var === 'string' &&
    'type' in value &&
    typeof value.type === 'string'
  );
}

// Usage
if (isJsonVariable(arg)) {
  console.log(`Variable: ${arg.$var} of type ${arg.type}`);
}
```

## TypeScript Configuration

For best experience, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

## GraphJSON Ecosystem

| Package                                                          | Description              | NPM                                                                                                   |
| ---------------------------------------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------- |
| [@graphjson/core](https://www.npmjs.com/package/@graphjson/core) | Core document generation | [![npm](https://img.shields.io/npm/v/@graphjson/core)](https://www.npmjs.com/package/@graphjson/core) |
| [@graphjson/ast](https://www.npmjs.com/package/@graphjson/ast)   | AST building utilities   | [![npm](https://img.shields.io/npm/v/@graphjson/ast)](https://www.npmjs.com/package/@graphjson/ast)   |
| [@graphjson/sdk](https://www.npmjs.com/package/@graphjson/sdk)   | High-level type-safe SDK | [![npm](https://img.shields.io/npm/v/@graphjson/sdk)](https://www.npmjs.com/package/@graphjson/sdk)   |

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](https://github.com/NexaLeaf/graphjson/blob/main/CONTRIBUTING.md).

## License

MIT © [NexaLeaf](https://github.com/NexaLeaf)
