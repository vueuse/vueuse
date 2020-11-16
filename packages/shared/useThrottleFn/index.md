# useThrottleFn

> Throttle execution of a function. Especially useful for rate limiting execution of handlers on events like resize and scroll.
>
> Throttle is a spring that throws balls: after a ball flies out it needs some time to shrink back, so it cannot throw any more balls unless it's ready.

## Usage

```js
import { useThrottleFn } from '@vueuse/core'

const throttledFn = useThrottleFn(() => {
  // do something, it will be called at most 1 time per second
}, 1000)

document.addEventLisenter('resize', throttledFn)
```

## Related Functions

- [useThrottle](https://vueuse.js.org/?path=/story/utilities--usethrottle)
- [useThrottleFn](https://vueuse.js.org/?path=/story/utilities--usethrottlefn)
- [useDebounce](https://vueuse.js.org/?path=/story/utilities--usedebounce)
- [useDebounceFn](https://vueuse.js.org/?path=/story/utilities--usedebouncefn)

## Recommended Reading

- [**Debounce vs Throttle**: Definitive Visual Guide](https://redd.one/blog/debounce-vs-throttle)
