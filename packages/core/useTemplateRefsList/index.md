---
category: Component
---

# useTemplateRefsList

Shorthand for binding refs to template elements and components inside `v-for`.

> This function only works for Vue 3.x.

## Usage

```html
<template>
  <div v-for="i of 5" :key="i" :ref="refs.set"></div>
</template>

<script setup lang="ts">
import { onUpdated } from 'vue'
import { useTemplateRefsList } from '@vueuse/core'

const refs = useTemplateRefsList<HTMLDivElement>()

onUpdated(() => {
  console.log(refs)
})
</script>
```
