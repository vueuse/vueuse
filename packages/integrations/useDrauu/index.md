---
category: '@Integrations'
---

# useDrauu

Reactive instance of drauu

## Usage

```html
<script setup>
import { ref } from 'vue'
import { useDrauu } from '@vueuse/integrations'

const target = ref()
const { undo, redo, canUndo, canRedo, brush: { color, size } } = useDrauu(target)
</script>

<template>
  <svg ref="target"></svg>
</template>
```
