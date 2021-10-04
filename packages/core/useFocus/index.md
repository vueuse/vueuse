---
category: Sensors
---

# useFocus

Reactive utility to track or set the focus state of a DOM element. State changes happen on `focus` and `blur` events. Setting reactive value from the outside will trigger `.focus()` and `blur()` events for `true` and `false` values respectively.

## Basic Usage

```ts
import { useFocus } from '@vueuse/core'

const focusableElement = ref();
const { focused } = useFocus({ target: focusableElement })

watch(focused, focused => {
  if (focused) console.log('input element has been focused')
  else console.log('input element has lost focus')
})
```

## Setting initial focus

To focus element on it's first render one can provide `initialValue` option with `true` value. This will trigger `.focus()` method call on the `target` element.

```ts
import { useFocus } from '@vueuse/core'

const focusableElement = ref();
const focusElementOnFirstRender = true;
const { focused } = useFocus({
  target: focusableElement,
  initialValue: focusElementOnFirstRender,
})
```

## Change focus state

Changes of the `focused` reactive ref will automatically trigger `.focus()` and `.blur()` calls for `true` and `false` values respectively. You can utilize this behavior to e.g. trigger element focus as a result of another action (in an example below - button click).

```html
<template>
  <div>
    <button type="button" @click="focused = true">Click me to focus input below</button>
    <input ref="inputElement" type="text">
  </div>
</template>

<script>
import { ref } from 'vue'
import { useFocus } from '@vueuse/core'

export default {
  setup() {
    const inputElement = ref(null)

    const { focused } = useFocus({ target: inputElement })

    return {
      inputElement,
      focused,
    }
  }
})
</script>
```
