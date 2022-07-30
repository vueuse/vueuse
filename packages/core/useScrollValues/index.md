---
category: Sensors
---

# useScrollValues

Reactive scroll position and state

## Usage


```html
<script setup lang="ts">
import { useScrollValues } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const { x, y, isScrolling, distances, rates } = useScrollValues(el)
</script>

<template>
  <div ref="el"></div>
</template>
```

```js
// With offsets
const { x, y, isScrolling, distances, rates } = useScrollValues(el, {
  offset: { top: 30, bottom: 30, right: 30, left: 30 },
})
```

## Directive Usage

```html
<script setup lang="ts">
import type { UseScrollValuesReturn } from '@vueuse/core'
import { vScrollValue } from '@vueuse/components'

const data = ref([1, 2, 3, 4, 5, 6])

function onScroll(state: UseScrollValuesReturn) {
  console.log(state) // {x, y, isScrolling, distances, rates}
}
</script>

<template>
  <div v-scroll="onScroll">
    <div v-for="item in data" :key="item">
      {{ item }}
    </div>
  </div>

  <!-- with options -->
  <div v-scroll="[onScroll, { 'throttle' : 10 }]">
    <div v-for="item in data" :key="item">
      {{ item }}
    </div>
  </div>
</template>
```
