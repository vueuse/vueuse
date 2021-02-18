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

<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export declare enum SwipeDirection {
  UP = "UP",
  RIGHT = "RIGHT",
  DOWN = "DOWN",
  LEFT = "LEFT",
}
export interface SwipeOptions extends ConfigurableWindow {
  /**
   * Register events as passive
   *
   * @default true
   */
  passive?: boolean
  /**
   * @default 50
   */
  threshold?: number
  /**
   * Callback on swipe start
   */
  onSwipeStart?: (e: TouchEvent) => void
  /**
   * Callback on swipe moves
   */
  onSwipe?: (e: TouchEvent) => void
  /**
   * Callback on swipe ends
   */
  onSwipeEnd?: (e: TouchEvent, direction: SwipeDirection) => void
}
/**
 * Reactive swipe detection.
 *
 * @see {@link https://vueuse.js.org/useSwipe}
 * @param target
 * @param options
 */
export declare function useSwipe(
  target: MaybeRef<EventTarget>,
  options?: SwipeOptions
): {
  isSwiping: Ref<boolean>
  direction: ComputedRef<SwipeDirection | null>
  coordsStart: {
    x: number
    y: number
  }
  coordsEnd: {
    x: number
    y: number
  }
  lengthX: ComputedRef<number>
  lengthY: ComputedRef<number>
  stop: () => void
}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useSwipe/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/useSwipe/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useSwipe/index.md)


<!--FOOTER_ENDS-->
