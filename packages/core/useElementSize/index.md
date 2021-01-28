---
category: Sensors
---

# useElementSize

Reactive size of an HTML element.

## Usage

```html
<template>
  <div ref="el">
    Height: {{ height }}
    Width: {{ Width }}
  </div>
</template>

<script>
import { ref } from 'vue'
import { useElementSize } from '@vueuse/core'

export default {
  setup() {
    const el = ref(null)
    const { width, height } = useElementSize(el)

    return {
      el,
      width,
      height,
    }
  }
})
</script>
```

[ResizeObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface ElementSize {
  width: number
  height: number
}
/**
 * Reactive size of an HTML element.
 *
 * @see   {@link https://vueuse.js.org/useElementSize}
 * @param target
 * @param callback
 * @param options
 */
export declare function useElementSize(
  target: MaybeRef<Element | null | undefined>,
  initialSize?: ElementSize,
  options?: ResizeObserverOptions
): {
  width: Ref<number>
  height: Ref<number>
}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useElementSize/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/useElementSize/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useElementSize/index.md)


<!--FOOTER_ENDS-->
