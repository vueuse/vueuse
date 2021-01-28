---
category: Sensors
---

# onClickOutside

Listen for clicks outside of an element. Useful for modal or dropdown.

## Usage

```html {18}
<template>
  <div ref="target">
    Hello world
  </div>
  <div>
    Outside element
  </div>
</template>

<script>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

export default {
  setup() {
    const target = ref(null)

    onClickOutside(target, (event) => console.log(event))

    return { target }
  }
}
</script>
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
declare const events: readonly ["mousedown", "touchstart"]
declare type EventType = WindowEventMap[typeof events[number]]
/**
 * Listen for clicks outside of an element.
 *
 * @see   {@link https://vueuse.js.org/onClickOutside}
 * @param target
 * @param handler
 * @param options
 */
export declare function onClickOutside(
  target: MaybeRef<Element | null | undefined>,
  handler: (evt: EventType) => void,
  options?: ConfigurableWindow
): (() => void) | undefined
export {}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/onClickOutside/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/onClickOutside/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/onClickOutside/index.md)


<!--FOOTER_ENDS-->
