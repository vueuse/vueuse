---
category: Sensors
---

# useScrollParent

Reactive nearest scrollable parent of the element

## Usage

```vue
<script setup lang="ts">
import { useScrollParent } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const scrollEl = useTemplateRef('el')
const scrollParent = useScrollParent(scrollEl)
</script>

<template>
  <div class="scrollable-element">
    <div ref="el" class="content" />
  </div>
</template>
```
