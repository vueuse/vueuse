# useThrottle

> Throttle changing of a ref value.

## Usage

```jsx {5,16}
import { useThrottle } from '@vueuse/core'

// in setup()
const input = ref('')
const throttled = useThrottle(input, 1000)
```

## Related Functions

- [useThrottle](https://vueuse.js.org/?path=/story/side-effects--usethrottle)
- [useThrottleFn](https://vueuse.js.org/?path=/story/side-effects--usethrottlefn)
- [useDebounce](https://vueuse.js.org/?path=/story/side-effects--usedebounce)
- [useDebounceFn](https://vueuse.js.org/?path=/story/side-effects--usedebouncefn)

## Recommended Reading

- [Debounce vs Throttle: Definitive Visual Guide](https://redd.one/blog/debounce-vs-throttle)
- [Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples/)
