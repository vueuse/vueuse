<script setup lang="ts">
import { rand } from '@vueuse/shared'
import { ref } from 'vue-demi'
import { useTransition, TransitionPresets } from '.'

const duration = 1500

const baseNumber = ref(0)

const baseVector = ref([0, 0])

const easeOutElastic = (n: number) => {
  return n === 0
    ? 0
    : n === 1
      ? 1
      : (2 ** (-10 * n)) * Math.sin((n * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1
}

const {
  isPaused,
  isTransitioning,
  output: cubicBezierNumber,
  pause: pauseA,
  resume: resumeA,
} = useTransition(baseNumber, {
  controls: true,
  duration,
  transition: [0.75, 0, 0.25, 1],
})

const {
  output: customFnNumber,
  pause: pauseB,
  resume: resumeB,
} = useTransition(baseNumber, {
  controls: true,
  duration,
  transition: easeOutElastic,
})

const {
  output: vector,
  pause: pauseC,
  resume: resumeC,
} = useTransition(baseVector, {
  controls: true,
  duration,
  transition: TransitionPresets.easeOutExpo,
})

const toggle = () => {
  baseNumber.value = baseNumber.value === 100 ? 0 : 100
  baseVector.value = [rand(0, 100), rand(0, 100)]
}

const pauseOrResume = () => {
  if (isPaused.value) {
    resumeA()
    resumeB()
    resumeC()
  }
  else {
    pauseA()
    pauseB()
    pauseC()
  }
}
</script>

<template>
  <div>
    <button @click="toggle">
      Transition
    </button>

    <button class="orange" :disabled="!isTransitioning" @click="pauseOrResume">
      {{ isPaused ? 'Resume' : 'Pause' }}
    </button>

    <p class="mt-2">
      Cubic bezier curve: <b>{{ cubicBezierNumber.toFixed(2) }}</b>
    </p>

    <div class="track number">
      <div class="relative">
        <div class="sled" :style="{ left: cubicBezierNumber + '%' }" />
      </div>
    </div>

    <p class="mt-2">
      Custom function: <b>{{ customFnNumber.toFixed(2) }}</b>
    </p>

    <div class="track number">
      <div class="relative">
        <div class="sled" :style="{ left: customFnNumber + '%' }" />
      </div>
    </div>

    <p class="mt-2">
      Vector: <b>[{{ vector[0].toFixed(2) }}, {{ vector[1].toFixed(2) }}]</b>
    </p>

    <div class="track vector">
      <div class="relative">
        <div class="sled" :style="{ left: vector[0] + '%', top: vector[1] + '%' }" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.track {
  background: rgba(125, 125, 125, 0.3);
  border-radius: 0.5rem;
  max-width: 20rem;
  width: 100%;
}

.sled {
  background: var(--c-brand);
  border-radius: 50%;
  height: 1rem;
  position: absolute;
  width: 1rem;
}

.number.track {
  height: 1rem;
  margin: 0.5rem 0;
  padding: 0 0.5rem;
}

.number.track .sled {
  transform: translateX(-50%);
}

.vector.track {
  padding: 0.5rem;
}

.vector.track .relative {
  padding-bottom: 30%;
}

.vector.track .sled {
  transform: translateX(-50%) translateY(-50%);
}
</style>
