---
category: Elements
---

# useIntersectionObserver

Detects that a target element's visibility.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const target = ref(null)
const targetIsVisible = ref(false)

const { stop } = useIntersectionObserver(
  target,
  ([{ isIntersecting }], observerElement) => {
    targetIsVisible.value = isIntersecting
  },
)
</script>

<template>
  <div ref="target">
    <h1>Hello world</h1>
  </div>
</template>
```

## Directive Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { vIntersectionObserver } from '@vueuse/components'

const root = ref(null)

const isVisible = ref(false)

function onIntersectionObserver([{ isIntersecting }]: IntersectionObserverEntry[]) {
  isVisible.value = isIntersecting
}
</script>

<template>
  <div>
    <p>
      Scroll me down!
    </p>
    <div v-intersection-observer="onIntersectionObserver">
      <p>Hello world!</p>
    </div>
  </div>

  <!-- with options -->
  <div ref="root">
    <p>
      Scroll me down!
    </p>
    <div v-intersection-observer="[onIntersectionObserver, { root }]">
      <p>Hello world!</p>
    </div>
  </div>
</template>
```

[IntersectionObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver)
