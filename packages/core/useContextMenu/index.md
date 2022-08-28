---
category: Elements
---

# useContextMenu

add [`contextMenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event) to your vue app with ease.

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
