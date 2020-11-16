# useThrottle

> Throttle changing of a ref value.

## Usage

```js
import { useThrottle } from '@vueuse/core'

const input = ref('')
const throttled = useThrottle(input, 1000)
```

## Related Functions

- [useThrottle](https://vueuse.js.org/?path=/story/utilities--usethrottle)
- [useThrottleFn](https://vueuse.js.org/?path=/story/utilities--usethrottlefn)
- [useDebounce](https://vueuse.js.org/?path=/story/utilities--usedebounce)
- [useDebounceFn](https://vueuse.js.org/?path=/story/utilities--usedebouncefn)

## Recommended Reading

- [Debounce vs Throttle: Definitive Visual Guide](https://redd.one/blog/debounce-vs-throttle)
- [Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples/)
