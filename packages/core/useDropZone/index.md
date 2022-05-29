---
category: Elements
---

# useDropZone

Create an zone where files can be dropped.

## Usage

```html
<script setup lang="ts">
import { useDropZone } from '@vueuse/core'

const dropZoneRef = ref(null)

function onDrop(files: File[] | null) {
  // Trigger an event when file(s) is drop on zone
}

const { isOverDropZone } = useDropZone(onDrop)

<template>
  <div ref="dropZoneRef">
    Drop files here
  </div>
</template>
</script>
```
