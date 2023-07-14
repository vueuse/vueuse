<script setup lang="ts">
import { useRandom } from '@vueuse/math'
import { ref } from 'vue-demi'

const min = ref(1)
const max = ref(10)
const result = useRandom(min, max) // min <= result && result < max
</script>

<template>
  <div>
    <label>Min: </label>
    <input v-model="min" type="number">
    <label>Max: </label>
    <input v-model="max" type="number">
  </div>
  <div>
    <h1>Result: {{ result }}</h1>
  </div>
</template>
