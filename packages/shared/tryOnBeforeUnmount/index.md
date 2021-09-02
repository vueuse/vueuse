---
category: Component
---

# tryOnUnmounted

Safe `onBeforeUnmount`. Call `onBeforeUnmount()` if it's inside a component lifecycle, if not, do nothing

## Usage

```js
import { tryOnBeforeUnmount } from '@vueuse/core'

tryOnBeforeUnmount(() => {

})
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Call onUnmounted() if it's inside a component lifecycle, if not, do nothing
 *
 * @param fn
 */
export declare function tryOnBeforeUnmount(fn: Fn): void
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/shared/tryOnBeforeUnmount/index.ts) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/shared/tryOnBeforeUnmount/index.md)


<!--FOOTER_ENDS-->
