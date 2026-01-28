# Contributing to GraphJSON

Thank you for your interest in contributing to GraphJSON! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Code Style](#code-style)
- [Documentation](#documentation)

## Code of Conduct

This project adheres to the Contributor Covenant Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/graphjson.git
   cd graphjson
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/NexaLeaf/graphjson.git
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm or pnpm
- Git

### Installation

```bash
# Install dependencies
npm install

# Verify setup
npm run build
npm run test
npm run lint
```

### Project Structure

```
graphjson/
├── libs/                    # Core libraries
│   ├── core/               # Core functionality
│   ├── ast/                # AST utilities
│   ├── json-dsl/           # JSON DSL
│   ├── parser/             # Query parser
│   ├── printer/            # Query printer
│   ├── schema/             # Schema validation
│   ├── sdk/                # High-level SDK
│   ├── plugins/            # Plugin system
│   ├── presets/            # Query presets
│   └── shared/             # Shared utilities
├── apps/
│   └── cli/                # CLI application
├── examples/               # Example projects
└── docs/                   # Documentation
```

## Making Changes

### Before You Start

1. **Check existing issues** - Avoid duplicate work
2. **Discuss major changes** - Open an issue first for significant features
3. **Keep changes focused** - One feature/fix per branch
4. **Update documentation** - Keep docs in sync with code

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make your changes
# ... edit files ...

# Run tests
npm run test

# Run linting
npm run lint

# Format code
npm run format

# Commit changes (see Commit Guidelines below)
git commit -m "feat: add new feature"

# Push to your fork
git push origin feature/my-feature
```

### Working with Nx

This is an Nx monorepo. Use Nx commands for development:

```bash
# Build specific package
npx nx build core

# Test specific package
npx nx test core

# Lint specific package
npx nx lint core

# View project graph
npx nx graph

# Run affected commands
npx nx affected -t test
npx nx affected -t build
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) for clear commit history and automatic versioning.

### Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, missing semicolons, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to build process, dependencies, or tooling
- **ci**: Changes to CI configuration files and scripts

### Scope

The scope specifies what part of the codebase is affected:

- `core` - Core library
- `ast` - AST utilities
- `parser` - Parser library
- `printer` - Printer library
- `schema` - Schema library
- `sdk` - SDK library
- `plugins` - Plugin system
- `presets` - Presets library
- `cli` - CLI application
- `docs` - Documentation
- `config` - Configuration files

### Examples

```bash
# Feature
git commit -m "feat(core): add support for nested queries"

# Bug fix
git commit -m "fix(parser): handle null values correctly"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Breaking change
git commit -m "feat(core)!: change API signature

BREAKING CHANGE: The buildQuery function now requires a config object"
```

## Pull Request Process

### Before Submitting

1. **Sync with upstream**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all checks**:
   ```bash
   npm run lint
   npm run test
   npm run build
   npm run typecheck
   ```

3. **Update documentation** if needed

### Creating a Pull Request

1. **Push your branch**:
   ```bash
   git push origin feature/my-feature
   ```

2. **Create PR on GitHub** with:
   - Clear title describing the change
   - Description of what changed and why
   - Reference to related issues (e.g., "Fixes #123")
   - Screenshots/examples if applicable

3. **PR Title Format**:
   ```
   feat(core): add support for nested queries
   fix(parser): handle null values correctly
   docs: update README
   ```

### PR Description Template

```markdown
## Description
Brief description of the changes.

## Related Issues
Fixes #123
Related to #456

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested these changes.

## Checklist
- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

- At least one maintainer review required
- All CI checks must pass
- Discussions resolved before merging
- Squash and merge strategy used

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests for specific package
npx nx test core

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Writing Tests

- Place tests next to source files: `src/file.ts` → `src/file.spec.ts`
- Use descriptive test names
- Test behavior, not implementation
- Aim for >80% coverage

### Test Example

```typescript
describe('buildQuery', () => {
  it('should generate valid GraphQL document', () => {
    const result = buildQuery({
      query: {
        users: {
          select: { id: true, name: true }
        }
      }
    });

    expect(result.ast).toBeDefined();
    expect(result.ast.kind).toBe('Document');
  });

  it('should extract variables correctly', () => {
    const result = buildQuery({
      query: {
        user: {
          args: {
            id: { $var: 'userId', type: 'ID!', default: '123' }
          },
          select: { name: true }
        }
      }
    });

    expect(result.variables).toEqual({ userId: '123' });
  });
});
```

## Code Style

### TypeScript

- Use strict mode (enforced by tsconfig)
- Explicit return types for functions
- No `any` types without justification
- Use interfaces over types for object shapes

### Formatting

Code is automatically formatted with Prettier. Run before committing:

```bash
npm run format
```

### Linting

ESLint enforces code quality. Fix issues with:

```bash
npm run lint:fix
```

### Naming Conventions

- **Files**: kebab-case (`my-file.ts`)
- **Classes**: PascalCase (`MyClass`)
- **Functions**: camelCase (`myFunction`)
- **Constants**: UPPER_SNAKE_CASE (`MY_CONSTANT`)
- **Interfaces**: PascalCase with `I` prefix (`IMyInterface`) or without (`MyInterface`)

### Module Boundaries

Respect the module boundary constraints defined in `eslint.config.mjs`. Each library can only import from allowed scopes.

## Documentation

### Code Comments

- Document complex logic
- Explain the "why", not the "what"
- Use JSDoc for public APIs

### JSDoc Example

```typescript
/**
 * Generates a GraphQL document from a JSON query definition.
 *
 * @param json - The JSON query definition
 * @returns An object containing the GraphQL AST and variables
 *
 * @example
 * ```typescript
 * const { ast, variables } = generateDocument({
 *   query: { users: { select: { id: true } } }
 * });
 * ```
 */
export function generateDocument(json: JsonDocument): GenerateResult {
  // Implementation
}
```

### README Updates

- Update package READMEs if API changes
- Keep examples working
- Update root README for major changes

### Changelog

Changelogs are auto-generated from commits. Ensure your commit messages are clear and follow the Conventional Commits format.

## Common Tasks

### Adding a New Feature

1. Create feature branch: `git checkout -b feature/my-feature`
2. Implement feature with tests
3. Update documentation
4. Run all checks: `npm run lint && npm run test && npm run build`
5. Commit with conventional message: `git commit -m "feat(scope): description"`
6. Push and create PR

### Fixing a Bug

1. Create bug branch: `git checkout -b fix/bug-description`
2. Write test that reproduces the bug
3. Fix the bug
4. Verify test passes
5. Commit: `git commit -m "fix(scope): description"`
6. Push and create PR

### Updating Documentation

1. Create docs branch: `git checkout -b docs/update-description`
2. Update relevant files
3. Commit: `git commit -m "docs(scope): description"`
4. Push and create PR

## Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Open a GitHub Issue with reproduction steps
- **Ideas**: Start a Discussion before opening an Issue

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- GitHub contributors page

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to GraphJSON! 🎉