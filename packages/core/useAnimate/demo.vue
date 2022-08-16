<script setup lang="ts">
import { shallowRef } from 'vue-demi'
import { useAnimate } from '@vueuse/core'
import type { MaybeElement } from '@vueuse/core'

const el = shallowRef<MaybeElement>()
const { play, pause, reverse, cancel } = useAnimate(
  el,
  [
    { clipPath: 'circle(20% at 0% 30%)' },
    { clipPath: 'circle(20% at 50% 80%)' },
    { clipPath: 'circle(20% at 100% 30%)' },
  ],
  {
    duration: 4000,
    iterations: Infinity,
    direction: 'alternate',
    easing: 'cubic-bezier(0.46, 0.03, 0.52, 0.96)',
  },
)
</script>

<template>
  <div class="relative flex items-center justify-center w-full h-60 overflow-hidden">
    <p ref="el" class="mb-12! text-5xl! text-$vp-c-brand font-800">
      VueUse useAnimate
    </p>
    <div class="absolute bottom-0 left-0">
      <button @click="play">
        play
      </button>
      <button @click="pause">
        pause
      </button>
      <button @click="reverse">
        reverse
      </button>
      <button @click="cancel">
        cancel
      </button>
    </div>
  </div>
</template>
