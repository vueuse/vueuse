<script setup lang="ts">
import { ref } from 'vue-demi'
import { useTransition } from '.'

const baseNumber = ref(0)

const easeOutElastic = (n: number) => {
  return n === 0
    ? 0
    : n === 1
      ? 1
      : (2 ** (-10 * n)) * Math.sin((n * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1
}

const cubicBezierNumber = useTransition(baseNumber, {
  duration: 1500,
  transition: [0.75, 0, 0.25, 1],
})

const customFnNumber = useTransition(baseNumber, {
  duration: 1500,
  transition: easeOutElastic,
})

const toggle = () => {
  baseNumber.value = baseNumber.value === 100 ? 0 : 100
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
  background: #68d391;
  border-radius: 50%;
  height: 1rem;
  position: absolute;
  transform: translateX(-50%);
  width: 1rem;
}
</style>
