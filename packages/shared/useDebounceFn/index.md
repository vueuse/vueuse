# useDebounceFn

> Debounce execution of a function.
>
> Debounce is an overloaded waiter: if you keep asking him your requests will be ignored until you stop and give him some time to think about your latest inquiry.

## Usage

```js
import { useDebounceFn } from '@vueuse/core'

const debouncedFn = useDebounceFn(() => {
  // do something
}, 1000)

document.addEventLisenter('resize', debouncedFn)
```

## Related Functions

- [useThrottle](https://vueuse.js.org/?path=/story/utilities--usethrottle)
- [useThrottleFn](https://vueuse.js.org/?path=/story/utilities--usethrottlefn)
- [useDebounce](https://vueuse.js.org/?path=/story/utilities--usedebounce)
- [useDebounceFn](https://vueuse.js.org/?path=/story/utilities--usedebouncefn)

## Recommended Reading

- [**Debounce vs Throttle**: Definitive Visual Guide](https://redd.one/blog/debounce-vs-throttle)
