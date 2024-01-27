---
category: Elements
---

# useResizeObserver

Reports changes to the dimensions of an Element's content or the border-box

## Usage

```vue
<script setup>
import { ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'

const el = ref(null)
const text = ref('')

useResizeObserver(el, (entries) => {
  const entry = entries[0]
  const { width, height } = entry.contentRect
  text.value = `width: ${width}, height: ${height}`
})
</script>

<template>
  <div ref="el">
    {{ text }}
  </div>
</template>
```

[ResizeObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
