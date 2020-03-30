# useThrottleFn

> Throttle execution of a function. Especially useful for rate limiting execution of handlers on events like resize and scroll.

## Usage

```jsx {5,16}
import { useThrottleFn } from '@vueuse/core'

// in setup()
const throttledFn = useThrottleFn(() => {
  // do something, it will be called at most 1 time per second
}, 1000)

document.addEventLisenter('resize', throttledFn)
```
