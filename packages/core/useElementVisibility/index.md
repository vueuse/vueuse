---
category: Sensors
---

# useElementVisibility

Tracks the visibility of an element within the viewport.

## Usage

```html
<template>
  <div ref="target">
    <h1>Hello world</h1>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useElementVisibility } from '@vueuse/core'

export default {
  setup() {
    const target = ref(null)
    const targetIsVisible = useElementVisibility(target)

    return {
      target,
      targetIsVisible,
    }
  }
}
</script>
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface VisibilityScrollTargetOptions extends ConfigurableWindow {
  scrollTarget?: Ref<Element | null | undefined>
}
/**
 * Tracks the visibility of an element within the viewport.
 *
 * @see   {@link https://vueuse.js.org/useElementVisibility}
 * @param element
 * @param options
 */
export declare function useElementVisibility(
  element: Ref<Element | null | undefined>,
  { window, scrollTarget }?: VisibilityScrollTargetOptions
): Ref<boolean>
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/master/packages/core/useElementVisibility/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/master/packages/core/useElementVisibility/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/master/packages/core/useElementVisibility/index.md)


<!--FOOTER_ENDS-->
