# Basic Example

The simplest GraphJSON example - converting a JSON query to GraphQL.

## What This Demonstrates

- ✅ Basic JSON query structure
- ✅ Field selection
- ✅ Document generation
- ✅ Printing GraphQL output

## Files

- `query.json` - The JSON query definition
- `run.ts` - Script that processes the query

## The Query

```json
{
  "query": {
    "users": {
      "select": {
        "id": true,
        "name": true
      }
    }
  }
}
```

This JSON represents a simple GraphQL query that fetches all users with their `id` and `name` fields.

## How It Works

### 1. JSON Structure

```json
{
  "query": {
    // ← Query operation
    "users": {
      // ← Root field
      "select": {
        // ← Field selection
        "id": true, // ← Select id field
        "name": true // ← Select name field
      }
    }
  }
}
```

### 2. Conversion to GraphQL

The `generateDocument` function converts this to a GraphQL AST:

```typescript
import { generateDocument } from '@graphjson/core';

const { ast, variables } = generateDocument(json);
```

### 3. Printing

Use GraphQL's `print` function to get the query string:

```typescript
import { print } from 'graphql';

console.log(print(ast));
```

## Running the Example

```bash
# From repository root
npx nx run basic:run
```

## Expected Output

```
--- GraphQL ---

query {
  users {
    id
    name
  }
}

--- Variables ---

{}
```

## Code Walkthrough

```typescript
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { print } from 'graphql';
import { generateDocument } from '@graphjson/core';

// Read the JSON query file
const json = JSON.parse(readFileSync(join(__dirname, 'query.json'), 'utf-8'));

// Generate GraphQL document
const { ast, variables } = generateDocument(json);

// Print the result
console.log(print(ast)); // GraphQL query string
console.log('variables:', variables); // Empty object (no variables)
```

## Key Concepts

### Field Selection

In GraphJSON, you select fields using an object:

```json
{
  "select": {
    "field1": true, // Include this field
    "field2": true // Include this field
  }
}
```

This is equivalent to:

```graphql
{
  field1
  field2
}
```

### Query Structure

Every GraphJSON query needs a root operation type:

```json
{
  "query": {
    /* ... */
  }, // Query operation
  "mutation": {
    /* ... */
  }, // Mutation operation (optional)
  "subscription": {
    /* ... */
  } // Subscription operation (optional)
}
```

## Try It Yourself

### Modify the Query

Edit `query.json` to add more fields:

```json
{
  "query": {
    "users": {
      "select": {
        "id": true,
        "name": true,
        "email": true, // Add this
        "createdAt": true // And this
      }
    }
  }
}
```

Run again:

```bash
npx nx run basic:run
```

### Add Another Root Field

```json
{
  "query": {
    "users": {
      "select": {
        "id": true,
        "name": true
      }
    },
    "posts": {
      // Add this
      "select": {
        "id": true,
        "title": true
      }
    }
  }
}
```

## Next Steps

Once you understand this basic example, move on to:

- **[Variables Example](../variables)** - Learn to use dynamic values
- **[Multilevel Example](../multilevel)** - Explore nested queries
- **[API Documentation](../../libs/core/README.md)** - Full API reference

## Related Documentation

- [@graphjson/core](../../libs/core/README.md) - Core library
- [@graphjson/json-dsl](../../libs/json-dsl/README.md) - Type definitions
- [GraphQL Spec](https://graphql.org/learn/) - GraphQL basics
