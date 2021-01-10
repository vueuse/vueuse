---
category: Sensors
---

# useElementBounding

> Reactive [bounding box](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) of an HTML element

## Usage

```html
<template>
  <div ref="el" />
</template>

<script>
import { ref } from 'vue'
import { useElementBounding } from '@vueuse/core'

export default {
  setup() {
    const el = ref(null)
    const { x, y, top, right, bottom, left, width, height } = useElementBounding(el)

    return {
      el,
      /* ... */
    }
  }
})
</script>
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Reactive size of an HTML element.
 *
 * @see   {@link https://vueuse.js.org/useElementSize}
 * @param target
 * @param callback
 * @param options
 */
export declare function useElementBounding(
  target: MaybeRef<Element | null | undefined>,
  options?: ResizeObserverOptions
): {
  x: Ref<number>
  y: Ref<number>
  top: Ref<number>
  right: Ref<number>
  bottom: Ref<number>
  left: Ref<number>
  width: Ref<number>
  height: Ref<number>
}
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/core/useElementBounding/index.ts) • [Demo](https://github.com/antfu/vueuse/blob/master/packages/core/useElementBounding/demo.vue) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/core/useElementBounding/index.md)


<!--FOOTER_ENDS-->