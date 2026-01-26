# Variables Example

Demonstrates how to use GraphQL variables in GraphJSON queries.

## What This Demonstrates

- ✅ Variable declaration with `$var`
- ✅ Variable types (ID!, String, Int, etc.)
- ✅ Default values
- ✅ Automatic variable extraction
- ✅ Dynamic query parameters

## Files

- `query.json` - JSON query with variable
- `run.ts` - Script that processes the query

## The Query

```json
{
  "query": {
    "user": {
      "args": {
        "id": { "$var": "userId", "type": "ID!" }
      },
      "select": {
        "id": true,
        "email": true
      }
    }
  }
}
```

## How It Works

### Variable Declaration

Instead of hardcoding values, use the `$var` syntax:

```json
{
  "args": {
    "id": {
      "$var": "userId",     // Variable name
      "type": "ID!",        // GraphQL type
      "default": "123"      // Optional default value
    }
  }
}
```

### What Happens

1. **GraphJSON** extracts the variable declaration
2. Creates a GraphQL variable: `$userId`
3. Adds it to the query's variable definitions
4. Replaces the argument with the variable reference

## Running the Example

```bash
# From repository root
npx nx run variables:run
```

## Expected Output

```
--- GraphQL ---

query($userId: ID!) {
  user(id: $userId) {
    id
    email
  }
}

--- Variables ---

{ userId: undefined }
```

**Note:** The variable value is `undefined` because no default was provided in this example.

## Variable Types

### All GraphQL Types Supported

```json
{
  "args": {
    "id": { "$var": "id", "type": "ID!" },
    "name": { "$var": "name", "type": "String" },
    "age": { "$var": "age", "type": "Int" },
    "score": { "$var": "score", "type": "Float" },
    "active": { "$var": "active", "type": "Boolean" },
    "tags": { "$var": "tags", "type": "[String!]!" }
  }
}
```

### Required vs Optional

```json
{
  "id": { "$var": "id", "type": "ID!" },      // Required (!)
  "name": { "$var": "name", "type": "String" } // Optional
}
```

### Default Values

Provide defaults for optional variables:

```json
{
  "limit": {
    "$var": "limit",
    "type": "Int",
    "default": 10        // ← Default value
  }
}
```

Result:
```typescript
variables: { limit: 10 }
```

## Complete Example with Defaults

```json
{
  "query": {
    "users": {
      "args": {
        "limit": {
          "$var": "limit",
          "type": "Int",
          "default": 10
        },
        "offset": {
          "$var": "offset",
          "type": "Int",
          "default": 0
        },
        "search": {
          "$var": "search",
          "type": "String"
        }
      },
      "select": {
        "id": true,
        "name": true,
        "email": true
      }
    }
  }
}
```

Generated GraphQL:

```graphql
query($limit: Int, $offset: Int, $search: String) {
  users(limit: $limit, offset: $offset, search: $search) {
    id
    name
    email
  }
}
```

Variables object:
```json
{
  "limit": 10,
  "offset": 0,
  "search": undefined
}
```

## Using Variables in Code

### With GraphQL Client

```typescript
import { generateDocument } from '@graphjson/core';
import { GraphQLClient } from 'your-graphql-client';

const { ast, variables } = generateDocument(query);

// Override default values
const result = await client.request(ast, {
  ...variables,
  userId: "user-123",  // Provide actual value
  limit: 20            // Override default
});
```

### TypeScript Type Safety

```typescript
import type { JsonDocument } from '@graphjson/json-dsl';

const query: JsonDocument = {
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
};
```

## Common Patterns

### Pagination Variables

```json
{
  "args": {
    "first": { "$var": "first", "type": "Int!", "default": 10 },
    "after": { "$var": "after", "type": "String" }
  }
}
```

### Filter Variables

```json
{
  "args": {
    "where": {
      "$var": "filter",
      "type": "UserFilterInput!",
      "default": { "active": true }
    }
  }
}
```

### ID Variables

```json
{
  "args": {
    "id": { "$var": "id", "type": "ID!" }
  }
}
```

## Benefits of Variables

✅ **Reusability** - Same query, different values  
✅ **Type Safety** - GraphQL validates variable types  
✅ **Performance** - Queries can be cached and reused  
✅ **Security** - Prevents injection attacks  
✅ **Cleaner Code** - Separate data from structure  

## Troubleshooting

### Variable Not Included

**Problem:** Variable defined but not in output

**Solution:** Check that `$var` is used in an `args` block:

```json
{
  "args": {
    "id": { "$var": "userId", "type": "ID!" }  // ✓ Correct
  }
}
```

### Type Mismatch

**Problem:** GraphQL error about type mismatch

**Solution:** Ensure type string matches GraphQL schema:

```json
{ "$var": "id", "type": "ID!" }      // ✓ Correct
{ "$var": "id", "type": "String" }   // ✗ Wrong if schema expects ID
```

## Next Steps

- **[Multilevel Example](../multilevel)** - Variables in nested queries
- **[Advanced Example](../advanced)** - Combined with SDK features
- **[Variables Documentation](../../libs/json-dsl/README.md)** - Full syntax reference

## Related

- [GraphQL Variables](https://graphql.org/learn/queries/#variables)
- [Type System](https://graphql.org/learn/schema/#type-system)