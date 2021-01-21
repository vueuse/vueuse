---
category: Sensors
---

# usePageLeave

Reactive state to show whether the mouse leaves the page.

## Usage

```js
import { usePageLeave } from '@vueuse/core'

const isLeft = usePageLeave()
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Reactive state to show whether mouse leaves the page.
 *
 * @see   {@link https://vueuse.js.org/usePageLeave}
 * @param options
 */
export declare function usePageLeave(options?: ConfigurableWindow): Ref<boolean>
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/master/packages/core/usePageLeave/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/master/packages/core/usePageLeave/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/master/packages/core/usePageLeave/index.md)


<!--FOOTER_ENDS-->