---
category: Sensors
---

# useScroll

Reactive scroll position and state.

## Usage


```html
<script setup lang="ts">
import { useScroll } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const { x, y, isScrolling, arrivedState, directions } = useScroll(el)
</script>

<template>
  <div ref="el"></div>
</template>
```

### With offsets
```js
const { x, y, isScrolling, arrivedState, directions } = useScroll(el, {
  offset: { top: 30, bottom: 30, right: 30, left: 30 },
})
```

### Setting scroll position

Set the `x` and `y` values to make the element scroll to that position.
```vue
<script setup lang="ts">
import { useScroll } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const { x, y } = useScroll(el)
</script>

<template>
  <div ref="el" />
  <button @click="x += 10">
    Scroll right 10px
  </button>
  <button @click="y += 10">
    Scroll down 10px
  </button>
</template>
```

### Smooth scrolling

Set `behavior: smooth` to enable smooth scrolling. The `behavior` option defaults to `auto`, which means no smooth scrolling. See the `behavior` option on [`window.scrollTo()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo) for more information.
```ts
import { useScroll } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const { x, y } = useScroll(el, { behavior: 'smooth' })

// Or as a `ref`:
const smooth = ref(false)
const behavior = computed(() => smooth.value ? 'smooth' : 'auto')
const { x, y } = useScroll(el, { behavior })
```

## Directive Usage

```html
<script setup lang="ts">
import type { UseScrollReturn } from '@vueuse/core'
import { vScroll } from '@vueuse/components'

const data = ref([1, 2, 3, 4, 5, 6])

function onScroll(state: UseScrollReturn) {
  console.log(state) // {x, y, isScrolling, arrivedState, directions}
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
