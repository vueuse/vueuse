---
category: Elements
---

# useDropZone

Create a zone where files can be dropped.

::: warning

Due to Safari browser limitations, file type validation is only possible during the drop event, not during drag events. As a result, the `isOverDropZone` value will always be `true` during drag operations in Safari, regardless of file type.

:::

## Usage

```vue
<script setup lang="ts">
import { useDropZone } from '@vueuse/core'

const dropZoneRef = ref<HTMLDivElement>()

function onDrop(files: File[] | null) {
  // called when files are dropped on zone
}

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop,
  // specify the types of data to be received.
  dataTypes: ['image/jpeg'],
  // control multi-file drop
  multiple: true,
  // whether to prevent default behavior for unhandled events
  preventDefaultForUnhandled: false,
})
</script>

<template>
  <div ref="dropZoneRef">
    Drop files here
  </div>
</template>
```
