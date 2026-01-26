# @graphjson/plugins

> Plugin system type definitions for GraphJSON

[![npm version](https://img.shields.io/npm/v/@graphjson/plugins)](https://www.npmjs.com/package/@graphjson/plugins)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

Type definitions and interfaces for creating GraphJSON plugins that can transform GraphQL documents.

## Why Use This?

- 🔌 **Plugin Interface** - Standard interface for creating plugins
- 🎯 **Type-Safe** - Full TypeScript support
- 🏗️ **Extensible** - Build custom transformations
- 📚 **Well-Defined** - Clear plugin lifecycle
- 🔧 **Flexible** - Transform documents or fields

## Installation

```bash
npm install @graphjson/plugins
```

## Quick Start

```typescript
import type { GraphJsonPlugin } from '@graphjson/plugins';
import { Kind } from 'graphql';

export function myPlugin(): GraphJsonPlugin {
  return {
    onDocument(document) {
      // Transform entire document
      return document;
    },
    onField(field, context) {
      // Transform individual fields
      return field;
    }
  };
}
```

## Plugin Interface

```typescript
interface GraphJsonPlugin {
  onDocument?: (document: DocumentNode) => DocumentNode | void;
  onField?: (field: FieldNode, context: PluginContext) => FieldNode | void;
}

interface PluginContext {
  path: string[];
}
```

## Creating Plugins

### Document-Level Plugin

Transforms the entire GraphQL document:

```typescript
export function addOperationName(name: string): GraphJsonPlugin {
  return {
    onDocument(document) {
      return {
        ...document,
        definitions: document.definitions.map(def => {
          if (def.kind === Kind.OPERATION_DEFINITION) {
            return {
              ...def,
              name: { kind: Kind.NAME, value: name }
            };
          }
          return def;
        })
      };
    }
  };
}
```

### Field-Level Plugin

Transforms individual fields:

```typescript
export function addTimestampField(): GraphJsonPlugin {
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

### Context-Aware Plugin

Use context to make decisions:

```typescript
export function depthLimiter(maxDepth: number): GraphJsonPlugin {
  return {
    onField(field, context) {
      if (context.path.length > maxDepth) {
        // Remove selections if too deep
        return {
          ...field,
          selectionSet: undefined
        };
      }
      return field;
    }
  };
}
```

## Plugin Examples

### Relay Pagination Plugin

```typescript
export function relayPagination(): GraphJsonPlugin {
  return {
    onField(field) {
      if (!field.selectionSet) return;

      const hasEdges = field.selectionSet.selections.some(
        s => s.kind === Kind.FIELD && s.name.value === 'edges'
      );

      if (hasEdges) return;

      return {
        ...field,
        selectionSet: {
          kind: Kind.SELECTION_SET,
          selections: [
            {
              kind: Kind.FIELD,
              name: { kind: Kind.NAME, value: 'edges' },
              selectionSet: {
                kind: Kind.SELECTION_SET,
                selections: [
                  {
                    kind: Kind.FIELD,
                    name: { kind: Kind.NAME, value: 'node' },
                    selectionSet: field.selectionSet
                  }
                ]
              }
            },
            {
              kind: Kind.FIELD,
              name: { kind: Kind.NAME, value: 'pageInfo' },
              selectionSet: {
                kind: Kind.SELECTION_SET,
                selections: [
                  { kind: Kind.FIELD, name: { kind: Kind.NAME, value: 'hasNextPage' } },
                  { kind: Kind.FIELD, name: { kind: Kind.NAME, value: 'endCursor' } }
                ]
              }
            }
          ]
        }
      };
    }
  };
}
```

### Auto-Include ID Plugin

```typescript
export function autoIncludeId(): GraphJsonPlugin {
  return {
    onField(field) {
      if (!field.selectionSet) return field;
      
      const hasId = field.selectionSet.selections.some(
        s => s.kind === Kind.FIELD && s.name.value === 'id'
      );
      
      if (hasId) return field;
      
      return {
        ...field,
        selectionSet: {
          ...field.selectionSet,
          selections: [
            {
              kind: Kind.FIELD,
              name: { kind: Kind.NAME, value: 'id' }
            },
            ...field.selectionSet.selections
          ]
        }
      };
    }
  };
}
```

## Using Plugins

### Single Plugin

```typescript
import { applyPlugins } from '@graphjson/core';
import { relayPagination } from '@graphjson/presets';

const transformed = applyPlugins(document, [relayPagination()]);
```

### Multiple Plugins

```typescript
import { applyPlugins } from '@graphjson/core';

const transformed = applyPlugins(document, [
  plugin1(),
  plugin2(),
  plugin3()
]);
```

Plugins are applied in order.

## TypeScript Support

```typescript
import type { GraphJsonPlugin, PluginContext } from '@graphjson/plugins';
import type { DocumentNode, FieldNode } from 'graphql';

export function typedPlugin(): GraphJsonPlugin {
  return {
    onDocument(document: DocumentNode): DocumentNode {
      return document;
    },
    onField(field: FieldNode, context: PluginContext): FieldNode {
      return field;
    }
  };
}
```

## GraphJSON Ecosystem

| Package | Description | NPM |
|---------|-------------|-----|
| [@graphjson/core](https://www.npmjs.com/package/@graphjson/core) | Core library (uses plugins) | [![npm](https://img.shields.io/npm/v/@graphjson/core)](https://www.npmjs.com/package/@graphjson/core) |
| [@graphjson/presets](https://www.npmjs.com/package/@graphjson/presets) | Pre-built plugins | [![npm](https://img.shields.io/npm/v/@graphjson/presets)](https://www.npmjs.com/package/@graphjson/presets) |

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](https://github.com/NexaLeaf/graphjson/blob/main/CONTRIBUTING.md).

## License

MIT © [NexaLeaf](https://github.com/NexaLeaf)