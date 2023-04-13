---
category: Reactivity
related: toValue
alias: resolveRef
---

# toRef

Normalize value/ref/getter to `ref` or `computed`.

## Usage

```ts
import { toRef } from '@vueuse/core'

const foo = ref('hi')

const a = toRef(0) // Ref<number>
const b = toRef(foo) // Ref<string>
const c = toRef(() => 'hi') // ComputedRef<string>
```
