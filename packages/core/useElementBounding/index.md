---
category: Elements
---

# useElementBounding

Reactive [bounding box](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) of an HTML element

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
}
</script>
```

## Component Usage

```html
<UseElementBounding v-slot="{ width, height }">
  Width: {{ width }}
  Height: {{ height }}
</UseElementBounding>
```
