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

## Directive Usage

```vue {20}
<script setup lang="ts">
import { vResizeObserver } from '@vueuse/components'
import { ref } from 'vue'

const disabled = ref(false)

function onResize(entries) {
  const [entry] = entries
  console.log(entry)
}

function toggle() {
  disabled.value = !disabled.value
}
</script>

<template>
  <div>
    <button @click="toggle">
      toggle
    </button>
    <textarea v-resize-observer:[disabled]="onResize" />
  </div>
</template>
```

[ResizeObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
