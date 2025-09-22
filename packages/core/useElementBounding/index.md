---
category: Elements
---

# useElementBounding

Reactive [bounding box](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) of an HTML element

## Usage

```vue
<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const { x, y, top, right, bottom, left, width, height } = useElementBounding(el)
</script>

<template>
  <div ref="el" />
</template>
```

## Component Usage

```vue
<template>
  <UseElementBounding v-slot="{ width, height }">
    Width: {{ width }} Height: {{ height }}
  </UseElementBounding>
</template>
```

## Directive Usage

```vue
<script setup lang="ts">
import { vElementBounding } from '@vueuse/components'

interface BoundingType {
  height: number
  bottom: number
  left: number
  right: number
  top: number
  width: number
  x: number
  y: number
}

function onBounding({ height, bottom, left, right, top, width, x, y }: BoundingType) {
  console.log(height, bottom, left, right, top, width, x, y)
}

const options = {
  reset: true,
  windowResize: true,
  windowScroll: true,
  immediate: true,
  updateTiming: 'sync',
}
</script>

<template>
  <textarea v-element-bounding="onBounding" />
  <!-- with options -->
  <textarea v-element-bounding="[onBounding, options]" />
</template>
```
