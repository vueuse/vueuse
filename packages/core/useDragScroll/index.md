---
category: Elements
---

# useDragScroll

Make elements draggable scrolling.

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useDragScroll } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)

useDragScroll(el)
</script>

<template>
  <div ref="el" :style="{ width: '300px', height: '300px', overflow: 'auto' }">
    <p :style="{ width: '500px', height: '500px' }">
      <!--   content    -->
    </p>
  </div>
</template>
```

## Component Usage

```vue
<template>
  <UseDragScroll :style="{ width: '300px', height: '300px', overflow: 'auto' }">
    <p :style="{ width: '500px', height: '500px' }">
      <!--   content    -->
    </p>
  </UseDragScroll>
</template>
```
