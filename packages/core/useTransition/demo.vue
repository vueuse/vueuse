<script setup lang="ts">
import { defineComponent, ref } from 'vue-demi'
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

      const toggle() {
          baseNumber.value = baseNumber.value === 100 ? 0 : 100
        },
        baseNumber,
        cubicBezierNumber,
        customFnNumber,
        track,
        sled,
</script>

<template>
  <div>
    <button @click="toggle">Transition</button>

    <p class="mt-2">
      Base number: <b>{{ baseNumber }}</b>
    </p>

    <p class="mt-2">
      Cubic bezier curve: <b>{{ cubicBezierNumber.toFixed(2) }}</b>
    </p>

    <div :style="track">
      <div class="relative">
        <div :style="{ ...sled, left: cubicBezierNumber + '%' }" />
      </div>
    </div>

    <p class="mt-2">
      Custom function: <b>{{ customFnNumber.toFixed(2) }}</b>
    </p>

    <div :style="track">
      <div class="relative">
        <div :style="{ ...sled, left: customFnNumber + '%' }" />
      </div>
    </div>
  </div>
</template>
