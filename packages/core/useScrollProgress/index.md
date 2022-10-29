---
category: Sensors
---

# useScrollProgress

Reactive scroll progress.

## Usage

```vue
<script setup lang="ts">
import { useScrollProgress } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const { progressX, progressY } = useScrollProgress(el)
</script>

<template>
  <div ref="el" />
</template>
```

Both `progressX` and `progressY` are decimals between 0 and 1, e.g, `progressY` is 0.5 means it's scrolled to the vertical center.

### Setting scroll position

Set the `progressX` and `progressY` values to make the element scroll to that position.

```vue
<script setup lang="ts">
import { useScrollProgress } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const { progressX, progressY } = useScrollProgress(el)
</script>

<template>
  <div ref="el" />
  <button @click="progressX += 0.1">
    Scroll right 10%
  </button>
  <button @click="progressY += 0.1">
    Scroll down 10%
  </button>
</template>
```

### Smooth scrolling

Set `behavior: smooth` to enable smooth scrolling. The `behavior` option defaults to `auto`, which means no smooth scrolling. See the `behavior` option on [`window.scrollTo()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo) for more information.

```vue
<script setup lang="ts">
import { useScrollProgress } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const { progressX, progressY } = useScrollProgress(el, { behavior: 'smooth' })
</script>

<template>
  <div ref="el" />
</template>
```

## Directive Usage

```vue
<script setup lang="ts">
import type { UseScrollProgressReturn } from '@vueuse/core'
import { vScrollProgress } from '@vueuse/components'

const data = ref([1, 2, 3, 4, 5, 6])

function onScroll(state: UseScrollProgressReturn) {
  console.log(state) // { progressX, progressY }
}
</script>

<template>
  <div v-scroll-progress="onScroll">
    <div v-for="item in data" :key="item">
      {{ item }}
    </div>
  </div>

  <!-- with options -->
  <div v-scroll="[onScroll, { behavior: 'smooth' }]">
    <div v-for="item in data" :key="item">
      {{ item }}
    </div>
  </div>
</template>
```
