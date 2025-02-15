<script setup lang="ts">
import { onClickOutside, useEventListener } from '@vueuse/core'
import { shallowRef, useTemplateRef } from 'vue'

const menu = useTemplateRef('menu')
const isOpen = shallowRef(false)

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
