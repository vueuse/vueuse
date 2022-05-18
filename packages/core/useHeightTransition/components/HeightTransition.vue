<script setup lang="ts">
import { useHeightTransition } from '@vueuse/core'
const { shrinkHeight, expandHeight } = useHeightTransition({
  duration: 500,
  easingExpand: 'ease-in-out',
  easingShrink: 'ease-in-out',
  opacityClosed: 0,
  opacityOpened: 1,
})
</script>

<template>
  <Transition
    :css="false"
    @enter="expandHeight"
    @leave="shrinkHeight"
  >
    <slot />
  </Transition>
</template>
