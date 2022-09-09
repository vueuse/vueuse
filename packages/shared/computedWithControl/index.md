---
category: Reactivity
alias: controlledComputed
---

# computedWithControl

Explicitly define the dependencies of computed.

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

### Manual Triggering

> This only works in Vue 3

You can also manually trigger the update of the computed by:

```ts
const computedRef = computedWithControl(
  () => source.value,
  () => counter.value,
)

computedRef.trigger()
```

> Works in both Vue2 & Vue3

To be compatible in both Vue2 & Vue3, specify the third parameter as `true` and use them separately:

```ts
const [computedRef, trigger] = computedWithControl(
  () => source.value,
  () => counter.value,
  true,
)

trigger()
```
