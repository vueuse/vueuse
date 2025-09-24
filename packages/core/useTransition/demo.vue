<script setup lang="ts">
import { rand, TransitionPresets, useTransition } from '@vueuse/core'
import { shallowRef } from 'vue'

const duration = 1500

const baseNumber = shallowRef(0)

const baseVector = shallowRef([0, 0])

const baseWord = shallowRef('Hello')

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
  transition: TransitionPresets.easeOutExpo,
})

const word = useTransition(baseWord, {
  duration,
  interpolation: wordlerp,
  transition: TransitionPresets.easeInOutExpo,
})

// Custom easing functions can control the progress of a transition,
function easeOutElastic(n: number) {
  return n === 0
    ? 0
    : n === 1
      ? 1
      : (2 ** (-10 * n)) * Math.sin((n * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1
}

// and custom interpolation functions control the value of the transition, at
// that progress. To demonstrate, let's say hello in a bunch of languages!
const greetings = [
  'Ahoj',
  'Bok',
  'Ciao',
  'Czesc',
  'Hallo',
  'Hei',
  'Hej',
  'Hello',
  'Hola',
  'Merhaba',
  'Moi',
  'Namaste',
  'Ola',
  'Privet',
  'Salam',
  'Salut',
  'Sawasdee',
  'Shalom',
  'Yia',
  'Zdravo',
]

function wordlerp(from: string, target: string, alpha: number) {
  from = from.padEnd(target.length)
  target = target.padEnd(from.length)

  const arr = from.split('')
  const steps = [from]

  while (arr.join('') !== target) {
    for (let i = 0; i < arr.length; i++) {
      const current = arr[i].charCodeAt(0)
      const next = target.charCodeAt(i)

      if (current < next) {
        arr[i] = String.fromCharCode(current + 1)
        break
      }
      else if (current > next) {
        arr[i] = String.fromCharCode(current - 1)
        break
      }
    }
    steps.push(arr.join(''))
  }

  if (alpha <= 0)
    return steps[0]
  if (alpha >= 1)
    return steps[steps.length - 1]
  return steps[Math.round(alpha * (steps.length - 1))]
}

function toggle() {
  baseNumber.value = baseNumber.value === 100 ? 0 : 100
  baseVector.value = [rand(0, 100), rand(0, 100)]
  const arr = greetings.filter(word => word !== baseWord.value)
  baseWord.value = arr[rand(0, arr.length - 1)]
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

    <p class="mt-2">
      Non-numeric value: <b>{{ word }}</b>
    </p>
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
  padding: 0.5rem;
}

.vector.track .relative {
  padding-bottom: 30%;
}

.vector.track .sled {
  transform: translateX(-50%) translateY(-50%);
}
</style>
