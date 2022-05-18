---
category: Animation
---

# useHeightTransition

Height transition of `div` element. Demo for `TransitionGroup` was derived from [Vue.js example](https://vuejs.org/guide/built-ins/transition-group.html#staggering-list-transitions)

## Usage

```vue
<script setup lang="ts">
import { useHeightTransition } from '@vueuse/core'
const { shrinkHeight, expandHeight } = useHeightTransition({
  duration: 250,
  easingEnter: 'ease-in-out',
  easingLeave: 'ease-in-out',
  opacityClosed: 0,
  opacityOpened: 1,
})
// //... or you can call it with defaults as:
// const { shrinkHeight, expandHeight } = useHeightTransition()
</script>

<template>
  <!-- Use it with <Transition> or <TransitionGroup> -->
  <Transition
    :css="false"
    @enter="expandHeight"
    @leave="shrinkHeight"
  >
    <slot />
  </Transition>
</template>
```
