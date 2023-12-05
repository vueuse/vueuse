---
category: Elements
---

# useElementSize

Reactive size of an HTML element. [ResizeObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)

## Usage

```vue
<script>
import { ref } from 'vue'
import { useElementSize } from '@vueuse/core'

export default {
  setup() {
    const el = ref(null)
    const { width, height } = useElementSize(el)

    return {
      el,
      width,
      height,
    }
  }
}
</script>

<template>
  <div ref="el">
    Height: {{ height }}
    Width: {{ width }}
  </div>
</template>
```

## Component Usage

```vue
<template>
  <UseElementSize v-slot="{ width, height }">
    Width: {{ width }} Height: {{ height }}
  </UseElementSize>
</template>
```

## Directive Usage

```vue
<script setup lang="ts">
import { vElementSize } from '@vueuse/components'
function onResize({ width, height }: { width: number, height: number }) {
  console.log(width, height)
}
</script>

<template>
  <textarea v-element-size="onResize" />
  <!-- with options -->
  <textarea v-element-size="[onResize, { width: 100, height: 100 }, { box: 'content-box' }]" />
</template>
```
