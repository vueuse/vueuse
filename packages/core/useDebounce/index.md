# useDebounce

> Debounce execution of a ref value.

## Usage

```jsx
import { useDebounce } from '@vueuse/core'

// in setup()
const input = ref('')
const debounced = useDebounce(input, 1000)
```

## Related Functions

- [useThrottle](https://vueuse.js.org/?path=/story/side-effects--usethrottle)
- [useThrottleFn](https://vueuse.js.org/?path=/story/side-effects--usethrottlefn)
- [useDebounce](https://vueuse.js.org/?path=/story/side-effects--usedebounce)
- [useDebounceFn](https://vueuse.js.org/?path=/story/side-effects--usedebouncefn)

## Recommended Reading

- [**Debounce vs Throttle**: Definitive Visual Guide](https://redd.one/blog/debounce-vs-throttle)
