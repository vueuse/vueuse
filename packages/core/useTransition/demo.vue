<script setup lang="ts">
import { rand } from '@vueuse/shared'
import { ref } from 'vue-demi'
import { useTransition } from '.'

const duration = 1500

const baseNumber = ref(0)

const baseVector = ref([50, 50])

const easeOutElastic = (n: number) => {
  return n === 0
    ? 0
    : n === 1
      ? 1
      : (2 ** (-10 * n)) * Math.sin((n * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1
}

const cubicBezierNumber = useTransition(baseNumber, {
  duration,
  transition: [0.75, 0, 0.25, 1],
})

const customFnNumber = useTransition(baseNumber, {
  duration,
  transition: easeOutElastic,
})

const transitionedVector = useTransition(baseVector, { duration })

const toggle = () => {
  baseNumber.value = baseNumber.value === 100 ? 0 : 100
  baseVector.value = [rand(0, 100), rand(0, 100)]
}
</script>

<template>
  <div>
    <button @click="toggle">
      Transition
    </button>

    <p class="mt-2">
      Base number: <b>{{ baseNumber }}</b>
    </p>

    <p class="mt-2">
      Cubic bezier curve: <b>{{ cubicBezierNumber.toFixed(2) }}</b>
    </p>

    <div class="track">
      <div class="relative">
        <div class="sled" :style="{ left: cubicBezierNumber + '%' }" />
      </div>
    </div>

    <p class="mt-2">
      Custom function: <b>{{ customFnNumber.toFixed(2) }}</b>
    </p>

    <div class="track">
      <div class="relative">
        <div class="sled" :style="{ left: customFnNumber + '%' }" />
      </div>
    </div>

    <p class="mt-2">
      Vector: <b>[{{ transitionedVector[0].toFixed(2) }}, {{ transitionedVector[1].toFixed(2) }}]</b>
    </p>
  </div>
</template>

<style scoped>
.track {
  background: rgba(125, 125, 125, 0.3);
  border-radius: 1rem;
  height: 1rem;
  margin: 0.5rem 0;
  max-width: 20rem;
  padding: 0 0.5rem;
  width: 100%;
}

.sled {
  background: var(--c-brand);
  border-radius: 50%;
  height: 1rem;
  position: absolute;
  transform: translateX(-50%);
  width: 1rem;
}
</style>
