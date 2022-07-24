---
category: Reactivity
related: resolveUnref
---

# resolveRef

Normalize value/ref/getter to `ref` or `computed`.

## Usage

```ts
import { resolveRef } from '@vueuse/core'

const foo = ref('hi')

const a = resolveRef(0) // Ref<number>
const b = resolveRef(foo) // Ref<string>
const c = resolveRef(() => 'hi') // ComputedRef<string>
```
