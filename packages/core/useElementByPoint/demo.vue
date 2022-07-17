<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { useElementBounding, useElementByPoint, useEventListener, useMouse } from '@vueuse/core'

const { x, y } = useMouse({ type: 'client' })
const { element } = useElementByPoint({ x, y })
const bounding = reactive(useElementBounding(element))

useEventListener('scroll', bounding.update, true)

const boxStyles = computed(() => {
  if (element.value) {
    return {
      display: 'block',
      width: `${bounding.width}px`,
      height: `${bounding.height}px`,
      left: `${bounding.left}px`,
      top: `${bounding.top}px`,
      backgroundColor: '#3eaf7c44',
      transition: 'all 0.05s linear',
    } as Record<string, string | number>
  }
  return {
    display: 'none',
  }
})

const pointStyles = computed<Record<string, string | number>>(() => ({
  transform: `translate(calc(${x.value}px - 50%), calc(${y.value}px - 50%))`,
}))
</script>

<template>
  <div
    :style="boxStyles"
    fixed
    pointer-events-none
    z-9999
    border="1 $vp-c-brand"
  />
  <div
    :style="pointStyles"
    fixed
    top-0
    left-0
    pointer-events-none
    w-2
    h-2
    rounded-full
    bg-green-400
    shadow
    z-999
  />
  <div class="flex items-center">
    <span class="mr-4">X</span>
    <input v-model="x" type="number">
  </div>
  <div class="flex items-center">
    <span class="mr-4">Y</span>
    <input v-model="y" type="number">
  </div>
</template>
