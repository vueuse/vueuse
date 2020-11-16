# useMouseInElement

> Reactive mouse position related to an element

## Usage

```html {15}
<template>
  <div ref="target">
    <h1>Hello world</h1>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useMouseInElement } from '@vueuse/core'

export default {
  setup() {
    const el = ref(null)

    const { x, y, isOutside } = useMouseInElement(el)

    return { x, y, isOutside }
  }
}
</script>
```
