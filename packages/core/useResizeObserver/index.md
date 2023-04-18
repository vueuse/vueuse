---
category: Elements
---

# useResizeObserver

Reports changes to the dimensions of an Element's content or the border-box

## Usage

```html {16-20}
<template>
  <div ref="el">
    {{text}}
  </div>
</template>

<script>
import { ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'

export default {
  setup() {
    const el = ref(null)
    const text = ref('')

    useResizeObserver(el, (entries) => {
      const entry = entries[0]
      const { width, height } = entry.contentRect
      text.value = `width: ${width}, height: ${height}`
    })

    return {
      el,
      text,
    }
  }
}
</script>
```

[ResizeObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
