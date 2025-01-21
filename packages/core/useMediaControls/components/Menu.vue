<script setup lang="ts">
import { onClickOutside, useEventListener } from '@vueuse/core'
import { ref } from 'vue'

const menu = ref()
const isOpen = ref()

onClickOutside(menu, () => isOpen.value = false)
useEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isOpen)
    isOpen.value = false
}, { passive: true })

function open() {
  return isOpen.value = true
}
function close() {
  return isOpen.value = false
}
</script>

<template>
  <div class="relative">
    <slot :open="open" />
    <div ref="menu" :class="{ 'pointer-events-none opacity-0': !isOpen }">
      <slot name="menu" :is-open="isOpen" :close="close" />
    </div>
  </div>
</template>
