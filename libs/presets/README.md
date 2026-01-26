# @graphjson/presets

> Pre-built plugins for common GraphQL patterns

[![npm version](https://img.shields.io/npm/v/@graphjson/presets)](https://www.npmjs.com/package/@graphjson/presets)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

GraphJSON Presets provides ready-to-use plugins for common GraphQL patterns like Relay pagination, eliminating boilerplate and ensuring consistency.

## Why Use This?

- 🎯 **Relay Pagination** - Automatic edges/nodes/pageInfo structure
- 🔌 **Plugin-Based** - Works with the GraphJSON plugin system
- ⚡ **Zero Config** - Works out of the box
- 🎨 **Customizable** - Extend or create your own presets
- 📦 **Lightweight** - Minimal dependencies

## Installation

```bash
npm install @graphjson/presets @graphjson/core
```

## Quick Start

```typescript
import { generateDocument, applyPlugins } from '@graphjson/core';
import { relayPagination } from '@graphjson/presets';

// Generate a basic query
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

// Apply Relay pagination preset
const relayQuery = applyPlugins(ast, [relayPagination()]);

// Result now includes edges { node { ... } } and pageInfo structure
```

## Available Presets

### `relayPagination()`

Transforms queries to follow the Relay pagination specification.

**Before:**
```graphql
query {
  posts(first: 20) {
    id
    title
  }
}
```

**After:**
```graphql
query {
  posts(first: 20) {
    edges {
      node {
        id
        title
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

## Usage

### With generateDocument

```typescript
import { generateDocument, applyPlugins } from '@graphjson/core';
import { relayPagination } from '@graphjson/presets';

const query = {
  query: {
    users: {
      args: { first: 10 },
      select: {
        id: true,
        name: true
      }
    }
  }
};

const { ast } = generateDocument(query);
const transformed = applyPlugins(ast, [relayPagination()]);
```

### With SDK

```typescript
import { query, field } from '@graphjson/sdk';

const q = query({
  posts: field()
    .paginate('relay')  // ← Uses relayPagination preset
    .args({ first: 20 })
    .select({
      id: true,
      title: true
    })
});
```

## Relay Pagination Details

### What It Does

The `relayPagination()` preset automatically wraps your field selection with the Relay connection structure:

**Original Field:**
```json
{
  "posts": {
    "select": {
      "id": true,
      "title": true
    }
  }
}
```

**Transformed:**
```json
{
  "posts": {
    "select": {
      "edges": {
        "select": {
          "node": {
            "select": {
              "id": true,
              "title": true
            }
          }
        }
      },
      "pageInfo": {
        "select": {
          "hasNextPage": true,
          "endCursor": true
        }
      }
    }
  }
}
```

### When to Use

Use Relay pagination when:
- ✅ Your API follows Relay cursor connections spec
- ✅ You need cursor-based pagination
- ✅ You want pageInfo metadata
- ✅ You're using Relay or similar clients

### Configuration

The preset works automatically with no configuration needed. It detects fields that should be paginated and applies the transformation.

## Integration Examples

### With Apollo Client

```typescript
import { ApolloClient } from '@apollo/client';
import { generateDocument, applyPlugins } from '@graphjson/core';
import { relayPagination } from '@graphjson/presets';

const { ast } = generateDocument(query);
const relayAst = applyPlugins(ast, [relayPagination()]);

const result = await client.query({
  query: relayAst,
  variables: { first: 20 }
});

// Access paginated data
const posts = result.data.posts.edges.map(edge => edge.node);
const hasMore = result.data.posts.pageInfo.hasNextPage;
```

### With React

```typescript
import { useState } from 'react';

function PostsList() {
  const [cursor, setCursor] = useState(null);
  
  const loadMore = async () => {
    const { ast } = generateDocument(postsQuery);
    const relayAst = applyPlugins(ast, [relayPagination()]);
    
    const result = await client.query({
      query: relayAst,
      variables: { first: 20, after: cursor }
    });
    
    const { edges, pageInfo } = result.data.posts;
    const newPosts = edges.map(e => e.node);
    
    if (pageInfo.hasNextPage) {
      setCursor(pageInfo.endCursor);
    }
    
    return newPosts;
  };
  
  // ... render logic
}
```

## Creating Custom Presets

You can create your own presets following the plugin interface:

```typescript
import type { GraphJsonPlugin } from '@graphjson/plugins';

export function customPreset(): GraphJsonPlugin {
  return {
    onDocument(document) {
      // Transform entire document
      return modifiedDocument;
    },
    onField(field, context) {
      // Transform individual fields
      return modifiedField;
    }
  };
}
```

Example - Add timestamp to all queries:

```typescript
export function addTimestamp(): GraphJsonPlugin {
  return {
    onField(field) {
      if (!field.selectionSet) return field;
      
      return {
        ...field,
        selectionSet: {
          ...field.selectionSet,
          selections: [
            ...field.selectionSet.selections,
            {
              kind: Kind.FIELD,
              name: { kind: Kind.NAME, value: 'timestamp' }
            }
          ]
        }
      };
    }
  };
}
```

## GraphJSON Ecosystem

| Package | Description | NPM |
|---------|-------------|-----|
| [@graphjson/core](https://www.npmjs.com/package/@graphjson/core) | Core document generation | [![npm](https://img.shields.io/npm/v/@graphjson/core)](https://www.npmjs.com/package/@graphjson/core) |
| [@graphjson/plugins](https://www.npmjs.com/package/@graphjson/plugins) | Plugin system types | [![npm](https://img.shields.io/npm/v/@graphjson/plugins)](https://www.npmjs.com/package/@graphjson/plugins) |
| [@graphjson/sdk](https://www.npmjs.com/package/@graphjson/sdk) | High-level SDK | [![npm](https://img.shields.io/npm/v/@graphjson/sdk)](https://www.npmjs.com/package/@graphjson/sdk) |

## Examples

See the [examples directory](https://github.com/NexaLeaf/graphjson/tree/main/examples):

- [Pagination Example](https://github.com/NexaLeaf/graphjson/tree/main/examples/pagination) - Relay pagination
- [Advanced Example](https://github.com/NexaLeaf/graphjson/tree/main/examples/advanced) - Combined features

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](https://github.com/NexaLeaf/graphjson/blob/main/CONTRIBUTING.md).

## License

MIT © [NexaLeaf](https://github.com/NexaLeaf)