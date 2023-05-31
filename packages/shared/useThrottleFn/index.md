---
category: Utilities
related: refThrottled, refDebounced, useDebounceFn
---

# useThrottleFn

Throttle execution of a function. Especially useful for rate limiting execution of handlers on events like resize and scroll.
>
> Throttle is a spring that throws balls: after a ball flies out it needs some time to shrink back, so it cannot throw any more balls unless it's ready.

## Usage

```js
import { useThrottleFn } from '@vueuse/core'

const throttledFn = useThrottleFn(() => {
  // do something, it will be called at most 1 time per second
}, 1000)

window.addEventListener('resize', throttledFn)
```

## Recommended Reading

- [**Debounce vs Throttle**: Definitive Visual Guide](https://redd.one/blog/debounce-vs-throttle)
