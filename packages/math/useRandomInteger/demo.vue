<script setup lang="ts">
import { ref } from 'vue'
import { useRandomInteger } from '@vueuse/math'

const min = ref(10)
const max = ref(100)

const integer = useRandomInteger(min, max)
</script>

<template>
  <div>
    min: <input v-model="min" type="number">
    max: <input v-model="max" type="number">
    result: {{ integer }}
  </div>
</template>
