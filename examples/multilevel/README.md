# Multilevel Example

Demonstrates deeply nested queries with multiple levels of data fetching.

## What This Demonstrates

- ✅ Deep nesting (4+ levels)
- ✅ Parent-child relationships
- ✅ Arguments at each level
- ✅ Complex data structures
- ✅ Real-world query patterns

## Files

- `query.json` - Multilevel nested JSON query
- `run.ts` - Script that processes the query

## The Query Structure

```
companies (Level 1)
  └─ departments (Level 2)
      └─ employees (Level 3)
          └─ projects (Level 4)
```

## Full Query

```json
{
  "query": {
    "companies": {
      "args": { "first": 5 },
      "select": {
        "id": true,
        "name": true,
        "departments": {
          "args": { "first": 3 },
          "select": {
            "id": true,
            "name": true,
            "employees": {
              "args": {
                "first": 10,
                "after": { "$var": "employeeCursor", "type": "String" }
              },
              "select": {
                "id": true,
                "firstName": true,
                "lastName": true,
                "projects": {
                  "args": { "active": true },
                  "select": {
                    "id": true,
                    "title": true,
                    "status": true
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## Running the Example

```bash
# From repository root
npx nx run multilevel:run
```

## Expected Output

```graphql
query ($employeeCursor: String) {
  companies(first: 5) {
    id
    name
    departments(first: 3) {
      id
      name
      employees(first: 10, after: $employeeCursor) {
        id
        firstName
        lastName
        projects(active: true) {
          id
          title
          status
        }
      }
    }
  }
}
```

## How It Works

### Level-by-Level Breakdown

#### Level 1: Companies

```json
{
  "companies": {
    "args": { "first": 5 },
    "select": {
      /* ... */
    }
  }
}
```

Fetches first 5 companies.

#### Level 2: Departments

```json
{
  "departments": {
    "args": { "first": 3 },
    "select": {
      /* ... */
    }
  }
}
```

For each company, fetches first 3 departments.

#### Level 3: Employees

```json
{
  "employees": {
    "args": {
      "first": 10,
      "after": { "$var": "employeeCursor", "type": "String" }
    },
    "select": {
      /* ... */
    }
  }
}
```

For each department, fetches first 10 employees with cursor support.

#### Level 4: Projects

```json
{
  "projects": {
    "args": { "active": true },
    "select": {
      "id": true,
      "title": true,
      "status": true
    }
  }
}
```

For each employee, fetches active projects.

## Key Patterns

### Nesting Fields

To nest a field, add it inside the parent's `select`:

```json
{
  "parent": {
    "select": {
      "id": true,
      "child": {
        // ← Nested field
        "select": {
          "id": true
        }
      }
    }
  }
}
```

### Arguments at Each Level

Each level can have its own arguments:

```json
{
  "level1": {
    "args": { "filter": "value1" },
    "select": {
      "level2": {
        "args": { "filter": "value2" },
        "select": {
          /* ... */
        }
      }
    }
  }
}
```

### Mixing Variables and Static Values

```json
{
  "args": {
    "first": 10, // Static
    "after": { "$var": "cursor", "type": "String" } // Variable
  }
}
```

## Real-World Use Cases

### E-commerce Product Hierarchy

```json
{
  "query": {
    "categories": {
      "select": {
        "name": true,
        "products": {
          "select": {
            "title": true,
            "price": true,
            "reviews": {
              "select": {
                "rating": true,
                "comment": true,
                "author": {
                  "select": {
                    "name": true
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### Social Media Feed

```json
{
  "query": {
    "feed": {
      "args": { "first": 20 },
      "select": {
        "id": true,
        "content": true,
        "author": {
          "select": {
            "name": true,
            "avatar": true,
            "followers": {
              "args": { "first": 5 },
              "select": {
                "name": true
              }
            }
          }
        },
        "comments": {
          "args": { "first": 10 },
          "select": {
            "text": true,
            "author": {
              "select": {
                "name": true
              }
            }
          }
        }
      }
    }
  }
}
```

## Performance Considerations

### Depth Limiting

Be careful with deep nesting - it can impact performance:

```json
{
  "args": {
    "first": 5, // ← Limit results at each level
    "maxDepth": 4 // ← Some APIs support depth limits
  }
}
```

### Selective Field Loading

Only fetch fields you need:

```json
{
  "select": {
    "id": true,
    "name": true
    // Don't fetch unnecessary fields
  }
}
```

## Best Practices

✅ **Limit depth** - Most queries shouldn't exceed 5 levels  
✅ **Use pagination** - Limit results at each level  
✅ **Select only needed fields** - Avoid over-fetching  
✅ **Consider fragments** - Reuse common selections  
✅ **Test performance** - Monitor query execution time

## Next Steps

- **[Advanced Example](../advanced)** - Add directives, aliases, and fragments
- **[Pagination Example](../pagination)** - Relay-style pagination
- **[SDK Documentation](../../libs/sdk/README.md)** - Type-safe query building

## Related

- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [Query Complexity](https://www.apollographql.com/blog/graphql/security/securing-your-graphql-api-from-malicious-queries/)
