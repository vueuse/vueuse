---
category: Sensors
---

# useSwipe

Reactive swipe detection based on [`TouchEvents`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent).

## Usage

```vue
<script setup lang="ts">
import { useSwipe } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const { isSwiping, direction } = useSwipe(el)
</script>

<template>
  <div ref="el">
    Swipe here
  </div>
</template>
```
