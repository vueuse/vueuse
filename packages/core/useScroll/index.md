---
category: Sensors
---

# useScroll

Reactive scroll position and state

## Usage

```html
<script setup lang="ts">
import { useScroll } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const { x, y, isScrolling, arrivedState } = useScroll(el)
</script>

<template>
  <div ref="el"></div>
</template>
```

```js
// With offsets
const { x, y, isScrolling, arrivedState } = useScroll(el, {
  offset: { top: 30, bottom: 30, right: 30, left: 30 },
})
```