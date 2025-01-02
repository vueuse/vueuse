---
category: Elements
---

# useIntersectionObserver

Detects that a target element's visibility.

## Usage

```vue
<script setup>
import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'

const target = ref(null)
const targetIsVisible = ref(false)

const { stop } = useIntersectionObserver(
  target,
  ([entry], observerElement) => {
    targetIsVisible.value = entry?.isIntersecting || false
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
import { vIntersectionObserver } from '@vueuse/components'
import { ref } from 'vue'

const root = ref(null)

const isVisible = ref(false)

function onIntersectionObserver([entry]: IntersectionObserverEntry[]) {
  isVisible.value = entry?.isIntersecting || false
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
