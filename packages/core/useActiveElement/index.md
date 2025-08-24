---
category: Elements
---

# useActiveElement

Reactive `document.activeElement`

## Usage

```vue
<script setup lang="ts">
import { useActiveElement } from '@vueuse/core'
import { watch } from 'vue'

const activeElement = useActiveElement()

watch(activeElement, (el) => {
  console.log('focus changed to', el)
})
</script>
```

## Component Usage

```vue
<template>
  <UseActiveElement v-slot="{ element }">
    Active element is {{ element?.dataset.id }}
  </UseActiveElement>
</template>
```
