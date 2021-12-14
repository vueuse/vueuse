<script lang="ts" setup>
import { computed, reactive } from 'vue-demi'
import { useElementBounding, useMouse, useEventListener } from '@vueuse/core'
import { useElementByPoint } from '.'

const { x, y } = useMouse({ type: 'client' })
const { element } = useElementByPoint({ x, y })
const bounding = reactive(useElementBounding(element))

useEventListener('scroll', bounding.update, true)

const boxStyles = computed<Record<string, string | number>>(() => {
  if (element.value) {
    return {
      position: 'fixed',
      width: `${bounding.width}px`,
      height: `${bounding.height}px`,
      left: `${bounding.left}px`,
      top: `${bounding.top}px`,
      backgroundColor: '#3eaf7c44',
      pointerEvents: 'none',
      zIndex: 9999,
      transition: 'all 0.05s linear',
      border: '1px solid var(--c-brand)',
    }
  }
  return {
    display: 'none',
  }
})

const pointStyles = computed<Record<string, string | number>>(() => ({
  position: 'fixed',
  left: '0px',
  top: '0px',
  pointerEvents: 'none',
  zIndex: 9999,
  transform: `translate(calc(${x.value}px - 50%), calc(${y.value}px - 50%))`,
}))
</script>

<template>
  <teleport to="body">
    <div ref="box" :style="boxStyles" />
    <div ref="point" :style="pointStyles" class="w-2 h-2 rounded-full bg-green-400 shadow" />
  </teleport>
  <div class="flex items-center">
    <span class="mr-4">x:</span>
    <input v-model="x" type="number">
  </div>
  <div class="flex items-center">
    <span class="mr-4">y:</span>
    <input v-model="y" type="number">
  </div>
</template>
