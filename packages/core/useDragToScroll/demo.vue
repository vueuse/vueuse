<script setup lang="ts">
import { ref } from 'vue-demi'
import { useDragToScroll, useToggle } from '@vueuse/core'

const target = ref()
const friction = ref(0.03)
const inertia = ref(true)
const toggle = useToggle(inertia)

const { pause, resume, isActive, isScrolling } = useDragToScroll(target, {
  friction,
  inertia,
})
</script>

<template>
  <div>
    <button @click="isActive ? pause() : resume()">
      {{ isActive ? 'Pause' : 'Resume' }}
    </button>
    <button @click="toggle()">
      {{ inertia ? 'Disable Inertia' : 'Enable Inertia' }}
    </button>
  </div>
  <span>Friction:</span>
  <input v-model="friction" type="number">

  <div>Is Scrolling: {{ isScrolling }}</div>

  <div ref="target" max-h-100 overflow-auto grid grid-cols-3 gap-4 mt4>
    <div v-for="i in 100" :key="i" bg="$vp-c-bg" select-none aspect-ratio-1 flex place-items-center place-content-center text-5xl>
      {{ i }}
    </div>
  </div>
</template>
