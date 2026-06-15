<script setup lang="ts">
import { useRafFn } from '@vueuse/core'
import { shallowRef } from 'vue'

const fpsLimit = 60
const count = shallowRef(0)
const deltaMs = shallowRef(0)
const { pause, resume } = useRafFn(({ delta }) => {
  deltaMs.value = delta
  count.value += 1
}, { fpsLimit })
</script>

<template>
  <div font-mono>
    Frames: {{ count }}
  </div>
  <div font-mono>
    Delta: {{ deltaMs.toFixed(0) }}ms
  </div>
  <div font-mono>
    FPS Limit: {{ fpsLimit }}
  </div>
  <button @click="pause">
    pause
  </button>
  <button @click="resume">
    resume
  </button>
</template>
