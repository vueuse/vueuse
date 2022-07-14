---
category: Reactivity
related: resolveRef
---

# resolveUnref

Get the value of value/ref/getter.

## Usage

```ts
import { resolveUnref } from '@vueuse/core'

const foo = ref('hi')

const a = resolveUnref(0) // 0
const b = resolveUnref(foo) // 'hi'
const c = resolveUnref(() => 'hi') // 'hi'
```
