---
slug: /getting-started
title: Getting Started
---

Welcome to GraphJSON. This page will guide you through setup and your first query.

## Install

```bash
pnpm add @graphjson/core @graphjson/sdk
```

## Quick Example

```ts
import { field, query, variable } from '@graphjson/sdk';

const doc = query(
  {
    user: field()
      .args({ id: variable('id', 'ID!') })
      .select({
        id: true,
        name: true,
      }),
  },
  'GetUser'
);
```
