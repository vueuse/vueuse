# useDebounce

> Debounce execution of a ref value.

## Usage

```js {4}
import { useDebounce } from '@vueuse/core'

const input = ref('foo')
const debounced = useDebounce(input, 1000)

input.value = 'bar'
console.log(debounced.value) // 'foo'

await sleep(1100)

console.log(debounced.value) // 'bar'
```

## Related Functions

- [useThrottle](https://vueuse.js.org/?path=/story/side-effects--usethrottle)
- [useThrottleFn](https://vueuse.js.org/?path=/story/side-effects--usethrottlefn)
- [useDebounce](https://vueuse.js.org/?path=/story/side-effects--usedebounce)
- [useDebounceFn](https://vueuse.js.org/?path=/story/side-effects--usedebouncefn)

## Recommended Reading

- [**Debounce vs Throttle**: Definitive Visual Guide](https://redd.one/blog/debounce-vs-throttle)
