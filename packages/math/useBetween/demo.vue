<script setup lang="ts">
import { ref } from 'vue'
import { useBetween } from '@vueuse/math'
const value = ref(0)
const min = ref(0)
const max = ref(10)

const isBetween = useBetween(value, min, max)
</script>

<template>
  <div>
    value:
    <input v-model="value" type="number">
    min:
    <input v-model="min" type="number">
    max:
    <input v-model="max" type="number">
    isBetween: <BooleanDisplay :value="isBetween" />
    <div>
      <button @click="value--">
        Decrement
      </button>
      <button @click="value++">
        Increment
      </button>
    </div>
  </div>
</template>
