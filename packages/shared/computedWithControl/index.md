---
category: Utilities
alias: controlledComputed
---

# computedWithControl

Explicitly define the deps of computed.

## Usage

```ts
import { computedWithControl } from '@vueuse/core'

const source = ref('foo')
const counter = ref(0)

const computedRef = computedWithControl(
  () => source.value, // watch source, same as `watch`
  () => counter.value, // computed getter, same as `computed`
)
```

With this, the changes of `counter` won't trigger `computedRef` to update but the `source` ref does.

```ts
console.log(computedRef.value) // 0

counter.value += 1

console.log(computedRef.value) // 0

source.value = 'bar'

console.log(computedRef.value) // 1
```
