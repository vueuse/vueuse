---
category: Utilities
---

# makeDestructurable

Make isomorphic destructurable for object and array at the same time. See [this blog](https://antfu.me/posts/destructuring-with-object-or-array/) for more details.

## Usage

TypeScript Example:

<!-- eslint-disable array-bracket-spacing -->
<!-- eslint-disable @typescript-eslint/no-redeclare -->

```ts
import { makeDestructurable } from '@vueuse/core'

const foo = { name: 'foo' }
const bar = 1024

const obj = makeDestructurable(
  { foo, bar } as const,
  [ foo, bar ] as const,
)
```

Usage:

<!-- eslint-disable array-bracket-spacing -->
<!-- eslint-disable @typescript-eslint/no-redeclare -->

```ts
let { foo, bar } = obj
let [ foo, bar ] = obj
```
