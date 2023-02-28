---
category: Sensors
---

# useFocus

Reactive utility to track or set the focus state of a DOM element. State changes to reflect whether the target element is the focused element. Setting reactive value from the outside will trigger `focus` and `blur` events for `true` and `false` values respectively.

## Basic Usage

```ts
import { useFocus } from '@vueuse/core'

const target = ref()
const { focused } = useFocus(target)

watch(focused, (focused) => {
  if (focused)
    console.log('input element has been focused')
  else console.log('input element has lost focus')
})
```

## Setting initial focus

To focus the element on its first render one can provide the `initialValue` option as `true`. This will trigger a `focus` event on the target element.

```ts
import { useFocus } from '@vueuse/core'

const target = ref()
const { focused } = useFocus(target, { initialValue: true })
```

## Change focus state

Changes of the `focused` reactive ref will automatically trigger `focus` and `blur` events for `true` and `false` values respectively. You can utilize this behavior to focus the target element as a result of another action (e.g. when a button click as shown below).

```html
<template>
  <div>
    <button type="button" @click="focused = true">Click me to focus input below</button>
    <input ref="input" type="text">
  </div>
</template>

<script>
import { ref } from 'vue'
import { useFocus } from '@vueuse/core'

export default {
  setup() {
    const input = ref()
    const { focused } = useFocus(input)

    return {
      input,
      focused,
    }
  }
}
</script>
```
