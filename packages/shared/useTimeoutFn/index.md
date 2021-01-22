---
category: Animation
---

# useTimeoutFn

Wrapper for `setTimeout` with controls.

```js
import { useTimeoutFn } from '@vueuse/core'

const { isActive, start, stop } = useTimeoutFn(() => {
  /* ... */
}, 3000)
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Wrapper for `setTimeout` with controls.
 *
 * @param cb
 * @param interval
 * @param immediate
 */
export declare function useTimeoutFn(
  cb: () => any,
  interval?: number,
  immediate?: boolean
): {
  isActive: Ref<boolean>
  start: () => void
  stop: () => void
}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/master/packages/shared/useTimeoutFn/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/master/packages/shared/useTimeoutFn/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/master/packages/shared/useTimeoutFn/index.md)


<!--FOOTER_ENDS-->