---
category: Component
---

::: tip
This function will be removed in future version.

Vue 3.5 introduced the `useTemplateRef` API which can effectively replace the functionality of `useTemplateRefsList`, therefore we recommend using the native approach.
:::

# useTemplateRefsList

Shorthand for binding refs to template elements and components inside `v-for`.

## Usage

```vue
<script setup lang="ts">
import { useTemplateRefsList } from '@vueuse/core'
import { onUpdated } from 'vue'

const refs = useTemplateRefsList<HTMLDivElement>()

onUpdated(() => {
  console.log(refs)
})
</script>

<template>
  <div v-for="i of 5" :key="i" :ref="refs.set" />
</template>
```
