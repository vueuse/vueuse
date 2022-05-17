---
category: Elements
---

# useDropZone

Create an zone where files can be dropped.

## Usage

```html
<script setup lang="ts">
import { useDropZone } from '@vueuse/core'

function onDrop(files: File[] | null) {
  // Trigger an event when file(s) is drop on zone
}

const { handlers, isOverDropZone } = useDropZone(onDrop)

<template>
  <div v-on="handlers">
    Drop files here
  </div>
</template>
</script>
```
