---
category: Watch
---

# whenever

Shorthand for watching value to be truthy.

## Usage

```js
import { useAsyncState, whenever } from '@vueuse/core'

const { state, isReady } = useAsyncState(
  fetch('https://jsonplaceholder.typicode.com/todos/1').then(t => t.json()),
  {},
)

whenever(isReady, () => console.log(state))
```

```ts
import { whenever } from '@vueuse/core'
// ---cut---
// this
whenever(ready, () => console.log(state))

// is equivalent to:
watch(ready, (isReady) => {
  if (isReady)
    console.log(state)
})
```

### Callback Function

Same as `watch`, the callback will be called with `cb(value, oldValue, onInvalidate)`.

```ts
import { whenever } from '@vueuse/core'
// ---cut---
whenever(height, (current, lastHeight) => {
  if (current > lastHeight)
    console.log(`Increasing height by ${current - lastHeight}`)
})
```

### Sources Array

Same as `watch`, multiple sources can be passed to check if any of them are true.

```ts
import { whenever } from '@vueuse/core'
// ---cut---
// this
whenever([result, error], () => {
  loading.value = false
})

// is equivalent to:
whenever(result, () => {
  loading.value = false
})
whenever(error, () => {
  loading.value = false
})
```

### Computed

Same as `watch`, you can pass a getter function to calculate on each change.

```ts
import { whenever } from '@vueuse/core'
// ---cut---
// this
whenever(
  () => counter.value === 7,
  () => console.log('counter is 7 now!'),
)
```

### Options

Options and defaults are same with `watch`.

```ts
import { whenever } from '@vueuse/core'
// ---cut---
// this
whenever(
  () => counter.value === 7,
  () => console.log('counter is 7 now!'),
  { flush: 'sync' },
)
```
