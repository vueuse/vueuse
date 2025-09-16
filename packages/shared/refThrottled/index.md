---
category: Reactivity
alias: useThrottle, throttledRef
---

# refThrottled

Throttle changing of a ref value.

## Usage

```ts
import { refThrottled } from '@vueuse/core'
import { shallowRef } from 'vue'

const input = shallowRef('')
const throttled = refThrottled(input, 1000)
```

An example with object ref.

```js
import { refThrottled } from '@vueuse/core'
import { shallowRef } from 'vue'

const data = shallowRef({
  count: 0,
  name: 'foo',
})
const throttled = refThrottled(data, 1000)

data.value = { count: 1, name: 'foo' }
console.log(throttled.value) // { count: 1, name: 'foo' } (immediate)

data.value = { count: 2, name: 'bar' }
data.value = { count: 3, name: 'baz' }
data.value = { count: 4, name: 'qux' }
console.log(throttled.value) // { count: 1, name: 'foo' } (still first value)

// After 1000ms, next change will be applied
await sleep(1100)
data.value = { count: 5, name: 'final' }
await nextTick()
console.log(throttled.value) // { count: 5, name: 'final' } (updated)
```

### Trailing

If you don't want to watch trailing changes, set 3rd param `false` (it's `true` by default):

```ts
import { refThrottled } from '@vueuse/core'
import { shallowRef } from 'vue'

const input = shallowRef('')
const throttled = refThrottled(input, 1000, false)
```

### Leading

Allows the callback to be invoked immediately (on the leading edge of the `ms` timeout). If you don't want this behavior, set the 4th param `false` (it's `true` by default):

```ts
import { refThrottled } from '@vueuse/core'
import { shallowRef } from 'vue'

const input = shallowRef('')
const throttled = refThrottled(input, 1000, undefined, false)
```

## Recommended Reading

- [Debounce vs Throttle: Definitive Visual Guide](https://kettanaito.com/blog/debounce-vs-throttle)
- [Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples/)
