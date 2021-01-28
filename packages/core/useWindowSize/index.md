---
category: Sensors
---

# useWindowSize

Reactive window size

## Usage

```js
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize()
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface WindowSizeOptions extends ConfigurableWindow {
  initialWidth?: number
  initialHeight?: number
}
/**
 * Reactive window size.
 *
 * @see   {@link https://vueuse.js.org/useWindowSize}
 * @param options
 */
export declare function useWindowSize({
  window,
  initialWidth,
  initialHeight,
}?: WindowSizeOptions): {
  width: Ref<number>
  height: Ref<number>
}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/master/packages/core/useWindowSize/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/master/packages/core/useWindowSize/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/master/packages/core/useWindowSize/index.md)


<!--FOOTER_ENDS-->
