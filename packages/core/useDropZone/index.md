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
  // called when files are dropped on zone
}

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)
</script>

<template>
  <div ref="dropZoneRef">
    Drop files here
  </div>
</template>
```
