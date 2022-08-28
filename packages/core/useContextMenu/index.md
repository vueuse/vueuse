---
category: Elements
---

# useContextMenu

customize your right click [`contextMenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event)

## Usage

```vue
<script setup lang="ts">
import { useContextMenu } from '@vueuse/core'
import { ref } from 'vue'

const menuRef = ref<HTMLElement | null>(null)
const hideOnClick = ref(false)

const { visible } = useContextMenu(menuRef, {
  hideOnClick,
})
</script>

<template>
  <div>
    <div ref="menuRef">
      <div>copy</div>
      <div>paste</div>
      <div>cut</div>
    </div>
  </div>
</template>

```
