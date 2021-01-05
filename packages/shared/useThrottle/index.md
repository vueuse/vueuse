---
category: Utilities
---

<!--DEMO_STARTS-->
<script setup>
import Demo from './demo.vue'
</script>
<DemoContainer><Demo/></DemoContainer>
<!--DEMO_ENDS-->

<!--HEAD_STARTS--><!--HEAD_ENDS-->


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


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param  delay  A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 */
export declare function useThrottle<T>(value: Ref<T>, delay?: number): Ref<T>
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/shared/useThrottle/index.ts) • [Demo](https://github.com/antfu/vueuse/blob/master/packages/shared/useThrottle/demo.vue) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/shared/useThrottle/index.md)


<!--FOOTER_ENDS-->