<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue-demi'
import { useElementBounding } from '@vueuse/core'
import { useElementByPoint } from '.'

const x = ref(-1)
const y = ref(-1)
const { element } = useElementByPoint(x, y)
const rect = reactive(useElementBounding(element))

const boxStyles = computed<Record<string, string | number> | undefined>(() => {
  if (element.value) {
    return {
      position: 'absolute',
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      backgroundColor: '#3eaf7c55',
      pointerEvents: 'none',
      zIndex: 9999,
      transition: 'all 0.2s ease-in-out',
    }
  }
})

const pointStyles = computed<Record<string, string | number>>(() => ({
  position: 'absolute',
  width: '10px',
  height: '10px',
  left: `${x.value}px`,
  top: `${y.value}px`,
  backgroundColor: 'red',
  pointerEvents: 'none',
  zIndex: 9999,
  transition: 'all 0.2s ease-in-out',
  transform: 'translate(-50%, -50%)',
}))

onMounted(() => {
  x.value = 0
  y.value = 0
})
</script>

<template>
  <teleport to="body">
    <div ref="box" :style="boxStyles"></div>
    <div ref="point" :style="pointStyles"></div>
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
