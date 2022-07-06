---
category: Elements
---

# useMouseInElement

Reactive mouse position related to an element

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
    const target = ref(null)

    const { x, y, isOutside } = useMouseInElement(target)

    return { x, y, isOutside }
  }
}
</script>
```

## Component Usage
```html
<UseMouseInElement v-slot="{ elementX, elementY, isOutside }">
  x: {{ elementX }}
  y: {{ elementY }}
  Is Outside: {{ isOutside }}
</UseMouseInElement>
```
