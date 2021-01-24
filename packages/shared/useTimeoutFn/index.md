---
category: Animation
---

# useTimeoutFn

Wrapper for `setTimeout` with controls.

```js
import { useTimeoutFn } from '@vueuse/core'

const { isPending, start, stop } = useTimeoutFn(() => {
  /* ... */
}, 3000)
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface TimeoutFnResult {
  start: Fn
  stop: Fn
  isPending: Ref<boolean>
  /**
   * @deprecated use `isPending` instead
   */
  isActive: Ref<boolean>
}
/**
 * Wrapper for `setTimeout` with controls.
 *
 * @param cb
 * @param interval
 * @param immediate
 */
export declare function useTimeoutFn(
  cb: (...args: unknown[]) => any,
  interval?: number,
  immediate?: boolean
): TimeoutFnResult
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/master/packages/shared/useTimeoutFn/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/master/packages/shared/useTimeoutFn/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/master/packages/shared/useTimeoutFn/index.md)


<!--FOOTER_ENDS-->