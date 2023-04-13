---
category: Sensors
---

# useInfiniteScroll

Infinite scrolling of the element.

## Usage

```html
<script setup lang="ts">
import { ref } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'

const el = ref<HTMLElement>(null)
const data = ref([1, 2, 3, 4, 5, 6])

useInfiniteScroll(
  el,
  () => {
    // load more
    data.value.push(...moreData)
  },
  { distance: 10 }
)
</script>

<template>
  <div ref="el">
    <div v-for="item in data">
      {{ item }}
    </div>
  </div>
</template>
```

## Directive Usage

```html
<script setup lang="ts">
import { ref } from 'vue'
import { vInfiniteScroll } from '@vueuse/components'

const data = ref([1, 2, 3, 4, 5, 6])

function onLoadMore() {
  const length = data.value.length + 1
  data.value.push(...Array.from({ length: 5 }, (_, i) => length + i))
}
</script>

<template>
  <div v-infinite-scroll="onLoadMore">
    <div v-for="item in data" :key="item">
      {{ item }}
    </div>
  </div>

  <!-- with options -->
  <div v-infinite-scroll="[onLoadMore, { 'distance' : 10 }]">
    <div v-for="item in data" :key="item">
      {{ item }}
    </div>
  </div>
</template>
```
