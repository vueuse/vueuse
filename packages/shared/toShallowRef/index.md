---
category: Reactivity
related: toRef
---

# toShallowRef

Normalize value/ref/getter to `shallowRef` or `computed`.

## Usage

```ts
import { toShallowRef } from '@vueuse/core'

const foo = ref('hi')

const a = toShallowRef(0) // ShallowRef<number>
const b = toShallowRef(foo) // Ref<string>
const c = toShallowRef(() => 'hi') // ComputedRef<string>
```
