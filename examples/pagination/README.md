# Pagination Example

Demonstrates cursor-based pagination patterns commonly used in GraphQL APIs.

## What This Demonstrates

- ✅ Cursor-based pagination
- ✅ `first` and `after` arguments
- ✅ Variable usage for dynamic pagination
- ✅ Pagination with variables
- ✅ Common pagination pattern

## Files

- `query.json` - JSON query with pagination
- `run.ts` - Script that processes the query

## The Query

```json
{
  "query": {
    "users": {
      "args": {
        "first": 10,
        "after": { "$var": "cursor", "type": "String" }
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

## Running the Example

```bash
# From repository root
npx nx run pagination:run
```

## Expected Output

```graphql
query ($cursor: String) {
  users(first: 10, after: $cursor) {
    id
    name
    email
  }
}
```

Variables:

```json
{
  "cursor": undefined
}
```

## How Cursor Pagination Works

### Basic Concept

Cursor-based pagination uses:

- **`first`** - Number of items to fetch
- **`after`** - Cursor pointing to where to start

```
Page 1: first: 10, after: null
        Returns: items 1-10, cursor: "abc123"

Page 2: first: 10, after: "abc123"
        Returns: items 11-20, cursor: "def456"

Page 3: first: 10, after: "def456"
        Returns: items 21-30, cursor: "ghi789"
```

### Advantages Over Offset Pagination

**Cursor-based** (this example):

```graphql
users(first: 10, after: "cursor123")
```

✅ Stable - Items won't be skipped if data changes  
✅ Efficient - Database can optimize lookups  
✅ Scalable - Works with large datasets

**Offset-based** (traditional):

```graphql
users(limit: 10, offset: 20)
```

❌ Unstable - Can skip/duplicate items if data changes  
❌ Slow - Full table scan on large offsets  
❌ Problematic with real-time data

## Relay Pagination Pattern

For Relay-compliant APIs, queries typically return:

```graphql
{
  users(first: 10, after: $cursor) {
    edges {
      # ← Array of edges
      node {
        # ← The actual item
        id
        name
      }
      cursor # ← Cursor for this item
    }
    pageInfo {
      # ← Pagination metadata
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

### Using Relay Preset

Instead of manually structuring the response, use the Relay preset:

```typescript
import { generateDocument } from '@graphjson/core';
import { applyPlugins } from '@graphjson/core';
import { relayPagination } from '@graphjson/presets';

const { ast } = generateDocument(query);
const transformed = applyPlugins(ast, [relayPagination()]);
```

Or with the SDK:

```typescript
import { query, field } from '@graphjson/sdk';

query({
  users: field()
    .paginate('relay') // ← Automatically adds edges/pageInfo
    .args({ first: 10 })
    .select({
      id: true,
      name: true,
    }),
});
```

## Pagination Patterns

### Forward Pagination

Fetch next page:

```json
{
  "args": {
    "first": 10,
    "after": { "$var": "cursor", "type": "String" }
  }
}
```

### Backward Pagination

Fetch previous page:

```json
{
  "args": {
    "last": 10,
    "before": { "$var": "cursor", "type": "String" }
  }
}
```

### Bidirectional Pagination

Support both directions:

```json
{
  "args": {
    "first": { "$var": "first", "type": "Int" },
    "after": { "$var": "after", "type": "String" },
    "last": { "$var": "last", "type": "Int" },
    "before": { "$var": "before", "type": "String" }
  }
}
```

## Complete Pagination Example

### Query with Full Pagination

```json
{
  "query": {
    "posts": {
      "args": {
        "first": { "$var": "pageSize", "type": "Int!", "default": 20 },
        "after": { "$var": "cursor", "type": "String" }
      },
      "select": {
        "edges": {
          "select": {
            "cursor": true,
            "node": {
              "select": {
                "id": true,
                "title": true,
                "content": true,
                "author": {
                  "select": {
                    "name": true,
                    "avatar": true
                  }
                }
              }
            }
          }
        },
        "pageInfo": {
          "select": {
            "hasNextPage": true,
            "hasPreviousPage": true,
            "startCursor": true,
            "endCursor": true
          }
        }
      }
    }
  }
}
```

### Using the Response

```typescript
const { ast, variables } = generateDocument(query);

const response = await client.request(ast, {
  ...variables,
  cursor: null, // First page
});

// Access data
const posts = response.posts.edges.map((edge) => edge.node);
const pageInfo = response.posts.pageInfo;

// Check if there are more pages
if (pageInfo.hasNextPage) {
  // Fetch next page
  const nextPage = await client.request(ast, {
    cursor: pageInfo.endCursor,
  });
}
```

## Implementation in Client Code

### React Hook Example

```typescript
import { useState } from 'react';
import { generateDocument } from '@graphjson/core';

function usePagination(query, pageSize = 10) {
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const { ast, variables } = generateDocument(query);

  const loadMore = async () => {
    const result = await client.request(ast, {
      ...variables,
      pageSize,
      cursor,
    });

    setCursor(result.posts.pageInfo.endCursor);
    setHasMore(result.posts.pageInfo.hasNextPage);

    return result.posts.edges.map((e) => e.node);
  };

  return { loadMore, hasMore };
}
```

### Infinite Scroll

```typescript
function InfiniteList() {
  const { loadMore, hasMore } = usePagination(postsQuery);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting && hasMore) {
        const newItems = await loadMore();
        setItems(prev => [...prev, ...newItems]);
      }
    });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <div>
      {items.map(item => <Item key={item.id} {...item} />)}
      {hasMore && <div ref={loaderRef}>Loading...</div>}
    </div>
  );
}
```

## Pagination Best Practices

### 1. Reasonable Page Size

```json
{
  "first": { "$var": "pageSize", "type": "Int!", "default": 20 }
}
```

Recommended sizes:

- **Lists**: 20-50 items
- **Cards/Grid**: 12-24 items
- **Tables**: 50-100 items
- **Infinite scroll**: 10-20 items per load

### 2. Always Include PageInfo

```json
{
  "select": {
    "edges": {
      /* ... */
    },
    "pageInfo": {
      "select": {
        "hasNextPage": true, // ← Essential
        "endCursor": true // ← For next page
      }
    }
  }
}
```

### 3. Handle Empty States

```typescript
if (result.posts.edges.length === 0) {
  console.log('No results found');
}
```

### 4. Cache Cursors

```typescript
const cursors = {
  current: null,
  previous: [],
};

// When loading next page
cursors.previous.push(cursors.current);
cursors.current = pageInfo.endCursor;

// When going back
cursors.current = cursors.previous.pop();
```

## Common Issues

### Issue: Missing PageInfo

**Problem:** Can't determine if there are more pages

**Solution:** Always include `pageInfo` in selection:

```json
{
  "select": {
    "edges": {
      /* ... */
    },
    "pageInfo": {
      "select": { "hasNextPage": true, "endCursor": true }
    }
  }
}
```

### Issue: Cursor Expired

**Problem:** Old cursor no longer valid

**Solution:** Handle gracefully, start from beginning:

```typescript
try {
  const result = await loadPage(cursor);
} catch (error) {
  if (error.message.includes('Invalid cursor')) {
    // Reset to first page
    setCursor(null);
  }
}
```

## Next Steps

- **[Advanced Example](../advanced)** - Combine with other features
- **[Relay Documentation](https://relay.dev/graphql/connections.htm)** - Official Relay spec
- **[Presets Documentation](../../libs/presets/README.md)** - Relay pagination preset

## Related

- [Pagination in GraphQL](https://graphql.org/learn/pagination/)
- [Relay Cursor Connections](https://relay.dev/graphql/connections.htm)
- [Best Practices](https://www.apollographql.com/docs/react/pagination/cursor-based/)
