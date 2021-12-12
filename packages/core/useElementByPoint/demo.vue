<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue-demi'
import { useElementBounding, useMouse, useScroll } from '@vueuse/core'
import { useElementByPoint } from '.'

const { x, y } = useMouse()
const { element } = useElementByPoint({ x, y })
const bounding = reactive(useElementBounding(element))

const sidebar = ref<HTMLElement>()

// update bounding when sidebar scroll
useScroll(sidebar, {
  onScroll: bounding.update,
})

const boxStyles = computed<Record<string, string | number> | undefined>(() => {
  if (element.value) {
    return {
      position: 'absolute',
      width: `${bounding.width}px`,
      height: `${bounding.height}px`,
      left: `${bounding.left}px`,
      top: `${bounding.top}px`,
      backgroundColor: '#3eaf7c44',
      pointerEvents: 'none',
      zIndex: 9999,
      transition: 'all 0.2s ease-in-out',
      border: '1px solid var(--c-brand)',
    }
  }
  return {
    display: 'none',
  }
})

const pointStyles = computed<Record<string, string | number>>(() => ({
  position: 'absolute',
  left: `${x.value}px`,
  top: `${y.value}px`,
  pointerEvents: 'none',
  zIndex: 9999,
  transform: 'translate(-50%, -50%)',
}))

onMounted(() => {
  sidebar.value = document.querySelector('.sidebar') as HTMLElement
})
</script>

<template>
  <teleport to="body">
    <div ref="box" :style="boxStyles"></div>
    <div ref="point" :style="pointStyles" class="w-2 h-2 rounded-full bg-green-400 shadow"></div>
  </teleport>
  <div class="flex items-center">
    <span class="mr-4">x:</span>
    <input v-model="x" type="number" />
  </div>
  <div class="flex items-center">
    <span class="mr-4">y:</span>
    <input v-model="y" type="number" />
  </div>
</template>
