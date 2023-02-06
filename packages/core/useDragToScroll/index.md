---
category: Sensors
---

# useDragToScroll

Reactive touch like scrolling with a mouse.

::: tip
When using this function, it is recommend that you set `user-select: none` on the target element.
:::

## Usage

```html
<script setup lang="ts">
import { useDragToScroll } from '@vueuse/core'

const target = ref()
const { pause, resume } = useDragToScroll(target)
</script>

<template>
  <div ref="target">
    My Scroll Container
  </div>
</template>
```

## Component Usage

```html
<UseDragToScroll>
  My Scroll Container
</UseDragToScroll>
```
