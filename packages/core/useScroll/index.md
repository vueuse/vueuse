---
category: Sensors
---

# useScroll

Reactive scroll position and state

Difference between `Wheel` & `Scroll`:

- `isWheeling` only detects mouse wheel whatever with or without scrollbar
- `wheelDirections` only detects mouse wheel directions whatever scrollbar arrived
- Dragging the scrollbar does not make `isWheeling` change

## Usage

```html
<script setup lang="ts">
import { useScroll } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const { x, y, isScrolling, isWheeling, arrivedState, scrollDirections, wheelDirections } = useScroll(el)
</script>

<template>
  <div ref="el"></div>
</template>
```

```js
// With offsets
const { x, y, isScrolling, arrivedState, directions } = useScroll(el, {
  offset: { top: 30, bottom: 30, right: 30, left: 30 },
})
```
