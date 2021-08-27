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

> This function uses [Event.composedPath()](https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath) which is NOT supported by IE 11, Edge 18 and below. If you are targeting these browsers, we recommend you to include [this code snippet](https://gist.github.com/sibbng/13e83b1dd1b733317ce0130ef07d4efd) on your project.

## Component

```html
<OnClickOutside @trigger="count++">
  <div>
    Click Outside of Me
  </div>
</OnClickOutside>
```

<LearnMoreComponents />

<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export declare type OnClickOutsideEvents = Pick<
  WindowEventMap,
  | "mousedown"
  | "mouseup"
  | "touchstart"
  | "touchend"
  | "pointerdown"
  | "pointerup"
>
export interface OnClickOutsideOptions<E extends keyof OnClickOutsideEvents>
  extends ConfigurableWindow {
  event?: E
}
/**
 * Listen for clicks outside of an element.
 *
 * @see https://vueuse.org/onClickOutside
 * @param target
 * @param handler
 * @param options
 */
export declare function onClickOutside<
  E extends keyof OnClickOutsideEvents = "pointerdown"
>(
  target: MaybeElementRef,
  handler: (evt: OnClickOutsideEvents[E]) => void,
  options?: OnClickOutsideOptions<E>
): Fn | undefined
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/onClickOutside/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/onClickOutside/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/onClickOutside/index.md)


<!--FOOTER_ENDS-->
