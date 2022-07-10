<script setup lang="ts">
import { ref } from 'vue'
import { usePow } from '@vueuse/math'

const base = ref(2)
const exponent = ref(3)
const value = usePow(base, exponent)
</script>

<template>
  <div>
    base:
    <input v-model="base" type="number">
    exponent:
    <input v-model="exponent" type="number">
    value:{{ value }}
  </div>
</template>
