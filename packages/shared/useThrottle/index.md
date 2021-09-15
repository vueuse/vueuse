---
category: Utilities
---

# useThrottle

Throttle changing of a ref value.

## Usage

```js
import { useThrottle } from '@vueuse/core'

const input = ref('')
const throttled = useThrottle(input, 1000)
```

### Trailing

If you don't want to watch trailing changes, set 3rd param `false` (it's `true` by default):

```js
import { useThrottle } from '@vueuse/core'

const input = ref('')
const throttled = useThrottle(input, 1000, false)
```


## Related Functions

- `useThrottle`
- `useThrottleFn`
- `useDebounce`
- `useDebounceFn`

## Recommended Reading

- [Debounce vs Throttle: Definitive Visual Guide](https://redd.one/blog/debounce-vs-throttle)
- [Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples/)
