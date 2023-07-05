---
category: Reactivity
related: toValue
---

# toValueDeep

Similar to `toValue` but also extract value of nested value/ref/getter.

## Usage

```ts
import { toValueDeep } from '@vueuse/core'

const foo = ref({ a: ref(1), b: { c: ref(2) } })
const bar = computed(() => [{ a: ref(1) }, { a: ref(2) }])

const b = toValueDeep(foo) // { a: 1, b: { c: 2 } }
const a = toValueDeep(bar) // [{ a: 1 }, { a: 2 }]
const c = toValueDeep(
  [{ a: ref(1) }, { a: ref(2) }]
) // [{ a: 1 }, { a: 2 }]
```
