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
/**
 * Reactive swipe detection.
 *
 * @see {@link https://vueuse.js.org/useSwipe}
 * @param target
 * @param options
 */
export declare function useSwipe(
  target: MaybeRef<EventTarget>,
  options?: {
    threshold?: number
    preventScrolling: boolean
    onSwipe?: (e: TouchEvent) => void
    onSwipeEnd?: (e: TouchEvent, direction: SwipeDirection) => void
  }
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
}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useSwipe/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/useSwipe/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useSwipe/index.md)


<!--FOOTER_ENDS-->
