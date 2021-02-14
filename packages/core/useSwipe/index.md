---
category: Sensors
---

# useSwipe

Reactive swipe detection based on [`TouchEvents`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent).

## Usage

```html {16-20}
<template>
  <div ref="el">
    Swipe here
  </div>
</template>

<script>
  setup() {
    const el = ref(null)
    const { direction } = useSwipe(el)

    return { el, direction }
  } 
</script>
```

## Limitations

By default scrolling will not work anymore while swiping the on the event target. 
If you want to keep the scrolling functionality, you simply can pass a custom `onSwipe`
event handler function in the `options`, which does not call `preventDefault`.

Regarding to this [`document`](https://docs.google.com/document/d/12-HPlSIF7-ISY8TQHtuQ3IqDi-isZVI0Yzv5zwl90VU/mobilebasic)
mouse events only will work if the 'touchmove' event handler calls preventDefault.
If you are looking for simpler touch gesture cases like scroll-x or scroll-y, it's worth a try looking
at this [`css solution`](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action)


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export declare enum SwipeDirection {
  UP = "UP",
  RIGHT = "RIGHT",
  DOWN = "DOWN",
  LEFT = "LEFT",
}
/**
 * Reactive swipe detection.
 *
 * @see {@link https://vueuse.js.org/useSwipe}
 * @param target
 * @param options
 */
export declare function useSwipe(
  target: MaybeRef<HTMLElement | null | undefined>,
  options?: {
    threshold?: number
    onSwipe?: (e: TouchEvent) => void
    onSwipeEnd?: (e: TouchEvent, direction: SwipeDirection) => void
  }
): {
  isSwiping: Ref<boolean>
  direction: ComputedRef<SwipeDirection | null>
  lengthX: ComputedRef<number>
  lengthY: ComputedRef<number>
}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useSwipe/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/useSwipe/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useSwipe/index.md)


<!--FOOTER_ENDS-->
