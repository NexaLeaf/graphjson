# GraphJSON Examples

This directory contains practical examples demonstrating the GraphJSON library capabilities.

## Quick Start

```bash
# Install dependencies (from root)
npm install

# Run any example
npx nx run basic:run
npx nx run variables:run
npx nx run multilevel:run
npx nx run advanced:run
npx nx run pagination:run
```

## Available Examples

### 1. [Basic](./basic) - Getting Started

The simplest possible example showing how to convert a JSON query to GraphQL.

**What it demonstrates:**
- Basic query structure
- Field selection
- Document generation

**Run it:**
```bash
npx nx run basic:run
```

[See detailed README →](./basic/README.md)

---

### 2. [Variables](./variables) - Using GraphQL Variables

Shows how to use variables in your queries for dynamic values.

**What it demonstrates:**
- Variable declaration with `$var`
- Variable types
- Default values
- Variable extraction

**Run it:**
```bash
npx nx run variables:run
```

[See detailed README →](./variables/README.md)

---

### 3. [Multilevel](./multilevel) - Nested Queries

Demonstrates deep nesting and complex query structures.

**What it demonstrates:**
- Multiple levels of nesting (4+ levels deep)
- Parent-child relationships
- Arguments at each level
- Complex data fetching

**Run it:**
```bash
npx nx run multilevel:run
```

[See detailed README →](./multilevel/README.md)

---

### 4. [Advanced](./advanced) - SDK Features

Shows the high-level SDK with all advanced features.

**What it demonstrates:**
- SDK query builder
- Pagination (Relay-style)
- Field aliases
- Directives (@include, @skip)
- Fragment spreads
- All features combined

**Run it:**
```bash
npx nx run advanced:run
```

[See detailed README →](./advanced/README.md)

---

### 5. [Pagination](./pagination) - Relay Pagination

Demonstrates Relay-style pagination patterns.

**What it demonstrates:**
- Relay pagination preset
- Edges and nodes structure
- PageInfo handling
- Cursor-based pagination

**Run it:**
```bash
npx nx run pagination:run
```

[See detailed README →](./pagination/README.md)

---

## Learning Path

If you're new to GraphJSON, follow this order:

1. **Basic** - Understand the core concept
2. **Variables** - Learn variable handling
3. **Multilevel** - See nesting in action
4. **Pagination** - Apply common patterns
5. **Advanced** - Master all features

## Structure

Each example follows this structure:

```
example-name/
├── README.md           # Detailed explanation
├── query.json          # JSON query definition (if applicable)
├── run.ts              # Runnable TypeScript example
└── project.json        # Nx project configuration
```

## Running Examples

### Individual Example

```bash
# Run specific example
npx nx run basic:run
```

### All Examples

```bash
# Run all examples
npx nx run-many -t run --projects=basic,variables,multilevel,advanced,pagination
```

### With Watch Mode

```bash
# Watch and re-run on changes
npx nx run basic:run --watch
```

## Modifying Examples

Feel free to modify the examples to experiment:

1. Edit `query.json` or the code in `run.ts`
2. Run the example to see results
3. Check the output in the terminal

## Output Format

All examples output:

1. **Generated GraphQL Query** - The actual GraphQL query string
2. **Variables** - Extracted variable values (if any)

Example output:
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

## Common Patterns

### Reading JSON from File

```typescript
import { readFileSync } from 'node:fs';
const json = JSON.parse(readFileSync('query.json', 'utf-8'));
```

### Using the SDK

```typescript
import { query, field, variable } from '@graphjson/sdk';

const input = query({
  users: field()
    .args({ limit: variable('limit', 'Int!', 10) })
    .select({ id: true, name: true })
});
```

### Generating and Printing

```typescript
import { generateDocument } from '@graphjson/core';
import { print } from 'graphql';

const { ast, variables } = generateDocument(input);
console.log(print(ast));
```

## Tips

- **Start simple** - Begin with the basic example
- **Experiment** - Modify examples to learn
- **Check output** - Compare JSON input with GraphQL output
- **Use TypeScript** - Get type checking and autocomplete

## Need Help?

- 📖 [Main Documentation](../README.md)
- 🐛 [Report Issues](https://github.com/NexaLeaf/graphjson/issues)
- 💬 [Ask Questions](https://github.com/NexaLeaf/graphjson/discussions)

## Contributing Examples

Have a useful example? Contributions welcome!

1. Create a new directory in `examples/`
2. Add `query.json` and `run.ts`
3. Add `README.md` explaining the example
4. Submit a pull request