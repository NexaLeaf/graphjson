# @graphjson/schema

> Schema validation utilities for GraphJSON queries

[![npm version](https://img.shields.io/npm/v/@graphjson/schema)](https://www.npmjs.com/package/@graphjson/schema)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

GraphJSON Schema provides validation utilities to ensure your JSON queries are valid before generating GraphQL documents.

## Why Use This?

- ✅ **Validation** - Validate JSON queries against schema rules
- 🛡️ **Error Prevention** - Catch errors early
- 🎯 **Type-Safe** - Full TypeScript support
- 📋 **Schema Rules** - Enforce query structure
- 🔍 **Detailed Errors** - Clear validation messages

## Installation

```bash
npm install @graphjson/schema
```

## Quick Start

```typescript
import { validateDocument } from '@graphjson/schema';

const query = {
  query: {
    users: {
      select: {
        id: true,
        name: true
      }
    }
  }
};

const result = validateDocument(query);

if (result.valid) {
  console.log('✓ Query is valid');
} else {
  console.error('✗ Validation errors:', result.errors);
}
```

## API Reference

### `validateDocument(json: JsonDocument): ValidationResult`

Validates a JSON document against GraphJSON schema rules.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `json` | `JsonDocument` | The JSON query to validate |

**Returns:** `ValidationResult` object with:

| Property | Type | Description |
|----------|------|-------------|
| `valid` | `boolean` | Whether the document is valid |
| `errors` | `string[]` | Array of validation error messages |

## Validation Rules

The validator checks for:

- ✅ Valid operation types (query, mutation, subscription)
- ✅ Proper field structure
- ✅ Valid variable declarations
- ✅ Correct select syntax
- ✅ Valid argument types

## Usage Examples

### Basic Validation

```typescript
import { validateDocument } from '@graphjson/schema';

const valid = validateDocument({
  query: {
    users: {
      select: {
        id: true,
        name: true
      }
    }
  }
});

console.log(valid); // { valid: true, errors: [] }
```

### Handling Validation Errors

```typescript
const result = validateDocument(query);

if (!result.valid) {
  result.errors.forEach(error => {
    console.error(`Validation error: ${error}`);
  });
  throw new Error('Invalid query structure');
}
```

### Pre-Generation Validation

```typescript
import { validateDocument } from '@graphjson/schema';
import { generateDocument } from '@graphjson/core';

function safeGenerate(json) {
  const validation = validateDocument(json);
  
  if (!validation.valid) {
    throw new Error(`Invalid query: ${validation.errors.join(', ')}`);
  }
  
  return generateDocument(json);
}
```

## GraphJSON Ecosystem

| Package | Description | NPM |
|---------|-------------|-----|
| [@graphjson/json-dsl](https://www.npmjs.com/package/@graphjson/json-dsl) | Type definitions | [![npm](https://img.shields.io/npm/v/@graphjson/json-dsl)](https://www.npmjs.com/package/@graphjson/json-dsl) |
| [@graphjson/core](https://www.npmjs.com/package/@graphjson/core) | Core document generation | [![npm](https://img.shields.io/npm/v/@graphjson/core)](https://www.npmjs.com/package/@graphjson/core) |

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](https://github.com/NexaLeaf/graphjson/blob/main/CONTRIBUTING.md).

## License

MIT © [NexaLeaf](https://github.com/NexaLeaf)