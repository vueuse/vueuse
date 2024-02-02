---
category: Reactivity
---

# computedRef

Instead of returning a non-reactive ref that `computed` does, `computedRef` returns a fully reactive ref.

It's similar to `reactiveComputed`, but returns a ref rather than reactive, and thus can be used for non-object values (including `undefined`).

## Usage

```ts
import { computedRef } from '@vueuse/core'

const data = ref('foo')

const state = computedRef(() => data.value)

console.log(state.value) // foo

state.name = 'bar'

console.log(state.value) // bar

data.value = 'baz'

console.log(state.name) // baz
```

### Manual Triggering

You can also manually trigger the update by:

```ts
const ref = computedRef(() => { /* ... */ })

ref.trigger()
```

::: warning
Manual triggering only works for Vue 3
:::
