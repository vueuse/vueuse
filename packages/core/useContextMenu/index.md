---
category: Elements
---

# useContextMenu

add [`contextMenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event) to your vue app with ease.

## Usage

```html
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

## Component Usage

### Specify the `menu` & `target` with named slots

The `menu` slot specifies the menu element, the `target` slot specifies the element that `menu` applies to. 

```html
<UseContextMenu>
  <template #menu>
    <div class="menu">
    <div class="menu-item">
      🚀 menu 1
    </div>
    <div class="menu-item">
      🎁 menu 2
    </div>
    <div class="menu-item">
      💖 menu 3
    </div>
    </div>
  </template>
  <template #target="{ visible }">
    <Area wa>
      <p>Renderless component</p>
      <p>visible: <BooleanDisplay :value="visible" /></p>
    </Area>
  </template>
</UseContextMenu>
```

### Global menu

Without specifying the `target`, the menu will be applied to `window`.

```html
<UseContextMenu>
    <div>🚀 menu 1</div>
    <div>🎁 menu 2</div>
    <div>💖 menu 3</div>
</UseContextMenu>
```
