<script setup lang="ts">
import { ref } from 'vue-demi'
import { useAnimate } from '@vueuse/core'
import type { MaybeElement } from '../unrefElement'

const el = ref<MaybeElement>()
const keyframes = ref([
  { transform: 'translateX(-200%)' },
  { transform: 'translateX(0)' },
  { transform: 'translateX(0) rotate(-360deg)' },
  { transform: 'translateX(200%) rotate(-360deg)' },
])
const options = {
  duration: 5000,
  delay: 1000,
  iterations: 1, // Infinity,
  immediate: false,
  onReady(animate: Animation) {
    console.log('onReady', animate)
  },
}

const {
  play,
  pause,
  reverse,
  cancel,
  finish,
} = useAnimate(el, keyframes, options)
</script>

<template>
  <div
    pos="relative"
    flex="~"
    justify="center"
    align="items-center"
    w="100%"
    h="400px"
    overflow="hidden"
  >
    <img
      ref="el"
      w="300px"
      h="300px"
      src="/favicon.svg"
      alt="vueuse"
    >
    <div pos="absolute top-0 left-0">
      <button m="r-2" @click="play">
        play
      </button>
      <button @click="pause">
        pause
      </button>
      <button @click="reverse">
        reverse
      </button>
      <button @click="finish">
        finish
      </button>
      <button @click="cancel">
        cancel
      </button>
    </div>
  </div>
</template>
