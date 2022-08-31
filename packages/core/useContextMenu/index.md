---
category: Elements
---

# useContextMenu

add [`contextMenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event) to your vue app with ease.

::: tip
After calling `stop()`, all event listeners related to the `contextMenu` will be irreversibly removed, later changes on the `enabled` ref will **NOT** have any effect.\
If you want to temporarily `disable` / `enable` it, use `enabled.value = false` / `enabled.value = true` instead.
:::
## Usage

```html
<script setup lang="ts">
import { useContextMenu } from '@vueuse/core'
import { ref } from 'vue'

const menuRef = ref<HTMLElement | null>(null)
const targetRef = ref<HTMLElement | null>(null)
const hideOnClick = ref(false)

const { visible, enabled, stop } = useContextMenu(menuRef, {
  hideOnClick,
})
</script>

<template>
  <div>
    <!-- menu element -->
    <div ref="menuRef">
      <div>copy</div>
      <div>paste</div>
      <div>cut</div>
    </div>
    <!-- the element that the menu applies to -->
    <div ref="targetRef" w-40 h-40>Right click on me!</div>
    <!-- other element -->
    <div>
      <button @click="enabled = !enabled">
       {{ enabled ? 'disable' : 'enable' }}
      </button>
      <button @click="stop()">stop</button>
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
  <template #target="{ visible, stop }">
    <Area wa>
      <p>Renderless component</p>
      <p>visible: <BooleanDisplay :value="visible" /></p>
      <button @click="stop()">stop</button>
    </Area>
  </template>
</UseContextMenu>
```

### Global menu

Without specifying the `target`, the menu will be applied to `window`.

```html
<UseContextMenu v-slot="{ stop }">
    <div>✅ Global 1</div>
    <div>✅ Global 2</div>
    <div>✅ Global 3</div>
    <div @click="stop()">
      🤚 Stop me
    </div>
</UseContextMenu>
```
