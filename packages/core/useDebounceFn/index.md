# useDebounceFn

> Debounce execution of a function.
>
> Debounce is an overloaded waiter: if you keep asking him your requests will be ignored until you stop and give him some time to think about your latest inquiry.

## Usage

```jsx {5,16}
import { useDebounceFn } from '@vueuse/core'

// in setup()
const debouncedFn = useDebounceFn(() => {
  // do something
}, 1000)

document.addEventLisenter('resize', debouncedFn)
```

## Related Functions

- [useThrottle](https://vueuse.js.org/?path=/story/side-effects--usethrottle)
- [useThrottleFn](https://vueuse.js.org/?path=/story/side-effects--usethrottlefn)
- [useDebounce](https://vueuse.js.org/?path=/story/side-effects--usedebounce)
- [useDebounceFn](https://vueuse.js.org/?path=/story/side-effects--usedebouncefn)

## Recommended Reading

- [**Debounce vs Throttle**: Definitive Visual Guide](https://redd.one/blog/debounce-vs-throttle)
