<script setup lang="ts">
import { rand, TransitionPresets, useTransition } from '@vueuse/core'
import { shallowRef } from 'vue'

const duration = 1500

const baseNumber = shallowRef(0)

const baseVector = shallowRef([0, 100])

function easeOutElastic(n: number) {
  return n === 0
    ? 0
    : n === 1
      ? 1
      : (2 ** (-10 * n)) * Math.sin((n * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1
}

function slerpNormalized(v1: [number, number], v2: [number, number], t: number) {
  const dot = Math.max(-1, Math.min(1, v1[0] * v2[0] + v1[1] * v2[1]))
  const theta = Math.acos(dot)
  const sinTheta = Math.sin(theta)

  // if vectors are nearly parallel (theta is close to 0 or PI),
  // fall back to linear interpolation to avoid division by zero
  if (sinTheta < 1e-6) {
    return [
      v1[0] + t * (v2[0] - v1[0]),
      v1[1] + t * (v2[1] - v1[1]),
    ]
  }

  const s1 = Math.sin((1 - t) * theta) / sinTheta
  const s2 = Math.sin(t * theta) / sinTheta

  return [
    s1 * v1[0] + s2 * v2[0],
    s1 * v1[1] + s2 * v2[1],
  ]
}

function slerp(v1: [number, number], v2: [number, number], t: number) {
  const mag1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1])
  const mag2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1])

  if (mag1 === 0 && mag2 === 0)
    return [0, 0]

  if (mag1 === 0)
    return [v2[0] * t, v2[1] * t]

  if (mag2 === 0)
    return [v1[0] * (1 - t), v1[1] * (1 - t)]

  const interpolatedDirection = slerpNormalized(
    [v1[0] / mag1, v1[1] / mag1],
    [v2[0] / mag2, v2[1] / mag2],
    t,
  )

  const interpolatedMagnitude = mag1 + t * (mag2 - mag1)

  return [
    interpolatedDirection[0] * interpolatedMagnitude,
    interpolatedDirection[1] * interpolatedMagnitude,
  ]
}

const cubicBezierNumber = useTransition(baseNumber, {
  duration,
  transition: [0.75, 0, 0.25, 1],
})

const customFnNumber = useTransition(baseNumber, {
  duration,
  transition: easeOutElastic,
})

const vector = useTransition(baseVector, {
  duration,
  interpolator: slerp,
  transition: TransitionPresets.easeOutCubic,
})

function toggle() {
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
      Cubic bezier curve: <b>{{ cubicBezierNumber.toFixed(2) }}</b>
    </p>

    <div class="track number">
      <div class="relative">
        <div class="sled" :style="{ left: `${cubicBezierNumber}%` }" />
      </div>
    </div>

    <p class="mt-2">
      Custom function: <b>{{ customFnNumber.toFixed(2) }}</b>
    </p>

    <div class="track number">
      <div class="relative">
        <div class="sled" :style="{ left: `${customFnNumber}%` }" />
      </div>
    </div>

    <p class="mt-2">
      Vector: <b>[{{ vector[0].toFixed(2) }}, {{ vector[1].toFixed(2) }}]</b>
    </p>

    <div class="track vector">
      <div class="relative">
        <div class="sled" :style="{ left: `${vector[0]}%`, top: `${vector[1]}%` }" />
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
  background: var(--vp-c-brand);
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
  aspect-ratio: 1;
  padding: 0.5rem;
}

.vector.track .relative {
  padding-bottom: 100%;
}

.vector.track .sled {
  transform: translateX(-50%) translateY(-50%);
}
</style>
