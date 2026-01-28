# Advanced Example

Demonstrates all GraphJSON SDK features including pagination, aliases, directives, and fragments.

## What This Demonstrates

- ✅ SDK Query Builder
- ✅ Relay-style pagination
- ✅ Field aliases
- ✅ GraphQL directives (@include, @skip)
- ✅ Fragment spreads
- ✅ Complex multilevel queries
- ✅ All features combined

## Files

- `run.ts` - Complete SDK example with all features
- `relay-run.ts` - Alternative with Relay pagination preset

## The SDK Approach

Unlike the basic examples using JSON files, this uses the TypeScript SDK for a more programmatic approach:

```typescript
import { query, field, variable } from '@graphjson/sdk';

const input = query({
  companies: field()
    .paginate('relay') // ← Pagination
    .args({ first: 5 })
    .select({
      id: true,
      name: true,

      departments: field()
        .args({ first: 3 })
        .select({
          id: true,
          name: true,

          employees: field()
            .alias('staff') // ← Alias
            .directive('include', { if: true }) // ← Directive
            .args({
              first: 10,
              after: variable('employeeCursor', 'String'),
            })
            .select({
              id: true,
              firstName: true,
              lastName: true,

              projects: field().directive('skip', { if: false }).args({ active: true }).select({
                id: true,
                title: true,
                status: true,
              }),

              '...EmployeeFields': true, // ← Fragment spread
            }),
        }),
    }),
});
```

## Running the Example

```bash
# Run the main SDK example
npx nx run advanced:run

# Run the Relay pagination version
npx nx run advanced:relay-run
```

## Expected Output

```graphql
query ($employeeCursor: String) {
  companies(first: 5) {
    edges {
      node {
        id
        name
        departments(first: 3) {
          id
          name
          staff: employees(first: 10, after: $employeeCursor) @include(if: true) {
            id
            firstName
            lastName
            projects(active: true) @skip(if: false) {
              id
              title
              status
            }
            ...EmployeeFields
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

## Features Explained

### 1. SDK Query Builder

Type-safe, chainable API:

```typescript
field()
  .args({
    /* ... */
  })
  .select({
    /* ... */
  })
  .alias('newName')
  .directive('include', { if: true });
```

Benefits:

- TypeScript autocomplete
- Compile-time type checking
- Fluent, readable syntax

### 2. Pagination

```typescript
field().paginate('relay');
```

Automatically wraps the field with Relay pagination structure:

```graphql
{
  edges {
    node {
      # Your fields here
    }
  }
  pageInfo {
    hasNextPage
    endCursor
  }
}
```

### 3. Aliases

```typescript
field().alias('staff');
```

Renames the field in the response:

```graphql
staff: employees {
  # ...
}
```

Usage:

```typescript
const data = await execute(ast);
console.log(data.staff); // Instead of data.employees
```

### 4. Directives

```typescript
field().directive('include', { if: true });
field().directive('skip', { if: false });
```

Generates:

```graphql
employees @include(if: true) {
  # ...
}

projects @skip(if: false) {
  # ...
}
```

Common directives:

- `@include(if: Boolean!)` - Include field conditionally
- `@skip(if: Boolean!)` - Skip field conditionally
- `@deprecated(reason: String)` - Mark as deprecated

### 5. Fragment Spreads

```typescript
{
  '...EmployeeFields': true
}
```

Generates:

```graphql
{
  id
  name
  ...EmployeeFields
}
```

Fragments must be defined separately in GraphQL.

### 6. Variables

```typescript
variable('employeeCursor', 'String');
variable('limit', 'Int!', 10); // With default
```

Creates GraphQL variables with proper type definitions.

## SDK API Reference

### `query(fields)`

Creates a query operation.

```typescript
query({
  users: field().select({ id: true }),
});
```

### `field()`

Creates a field builder.

**Methods:**

- `.args(obj)` - Add arguments
- `.select(obj)` - Select subfields
- `.alias(string)` - Set alias
- `.directive(name, args)` - Add directive
- `.paginate(style)` - Add pagination

### `variable(name, type, default?)`

Creates a variable reference.

```typescript
variable('userId', 'ID!'); // Required
variable('limit', 'Int', 10); // With default
```

## Practical Use Cases

### Conditional Field Loading

```typescript
const includeDetails = true;

query({
  users: field().select({
    id: true,
    name: true,
    details: field().directive('include', { if: includeDetails }).select({
      bio: true,
      avatar: true,
    }),
  }),
});
```

### Dynamic Pagination

```typescript
query({
  posts: field()
    .args({
      first: variable('pageSize', 'Int!', 20),
      after: variable('cursor', 'String'),
    })
    .paginate('relay')
    .select({
      id: true,
      title: true,
      content: true,
    }),
});
```

### Aliasing for Multiple Queries

```typescript
query({
  recent: field()
    .alias('recentPosts')
    .args({ first: 10, orderBy: 'CREATED_DESC' })
    .select({ id: true, title: true }),

  popular: field()
    .alias('popularPosts')
    .args({ first: 10, orderBy: 'VIEWS_DESC' })
    .select({ id: true, title: true }),
});
```

Result:

```graphql
{
  recentPosts: posts(first: 10, orderBy: CREATED_DESC) {
    id
    title
  }
  popularPosts: posts(first: 10, orderBy: VIEWS_DESC) {
    id
    title
  }
}
```

## Comparison: JSON vs SDK

### JSON Approach (Basic Examples)

```json
{
  "query": {
    "users": {
      "args": { "limit": 10 },
      "select": { "id": true }
    }
  }
}
```

**Pros:** Simple, declarative, can be stored/transmitted  
**Cons:** No type safety, verbose

### SDK Approach (Advanced Examples)

```typescript
query({
  users: field().args({ limit: 10 }).select({ id: true }),
});
```

**Pros:** Type-safe, autocomplete, chainable, less verbose  
**Cons:** Requires TypeScript, programmatic only

## Next Steps

- **[Pagination Example](../pagination)** - Focus on Relay pagination
- **[SDK Documentation](../../libs/sdk/README.md)** - Complete SDK API
- **[Presets Documentation](../../libs/presets/README.md)** - Relay and other presets

## Related

- [GraphQL Spec](https://spec.graphql.org/)
- [Relay Cursor Connections](https://relay.dev/graphql/connections.htm)
- [GraphQL Directives](https://graphql.org/learn/queries/#directives)
