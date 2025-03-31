---
category: Sensors
---

# useInfiniteScroll

Infinite scrolling of the element.

## Usage

```vue
<script setup lang="ts">
import { useInfiniteScroll } from '@vueuse/core'
import { ref, useTemplateRef } from 'vue'

const el = useTemplateRef<HTMLElement>('el')
const data = ref([1, 2, 3, 4, 5, 6])

const { reset } = useInfiniteScroll(
  el,
  () => {
    // load more
    data.value.push(...moreData)
  },
  {
    distance: 10,
    canLoadMore: () => {
      // inidicate when there is no more content to load so onLoadMore stops triggering
      // if (noMoreContent) return false
      return true // for demo purposes
    },
  }
)

function resetList() {
  data.value = []
  reset()
}
</script>

<template>
  <div ref="el">
    <div v-for="item in data">
      {{ item }}
    </div>
  </div>
  <button @click="resetList()">
    Reset
  </button>
</template>
```

## Direction

Different scroll directions require different CSS style settings:

| Direction          | Required CSS                                          |
| ------------------ | ----------------------------------------------------- |
| `bottom` (default) | No special settings required                          |
| `top`              | `display: flex;`<br>`flex-direction: column-reverse;` |
| `left`             | `display: flex;`<br>`flex-direction: row-reverse;`    |
| `right`            | `display: flex;`                                      |

::: warning
Make sure to indicate when there is no more content to load with `canLoadMore`, otherwise `onLoadMore` will trigger as long as there is space for more content.
:::

## Directive Usage

```vue
<script setup lang="ts">
import { vInfiniteScroll } from '@vueuse/components'
import { ref } from 'vue'

const data = ref([1, 2, 3, 4, 5, 6])

function onLoadMore() {
  const length = data.value.length + 1
  data.value.push(...Array.from({ length: 5 }, (_, i) => length + i))
}
function canLoadMore() {
  // inidicate when there is no more content to load so onLoadMore stops triggering
  // if (noMoreContent) return false
  return true // for demo purposes
}
</script>

<template>
  <div v-infinite-scroll="onLoadMore">
    <div v-for="item in data" :key="item">
      {{ item }}
    </div>
  </div>

  <!-- with options -->
  <div v-infinite-scroll="[onLoadMore, { distance: 10, canLoadMore }]">
    <div v-for="item in data" :key="item">
      {{ item }}
    </div>
  </div>
</template>
```
