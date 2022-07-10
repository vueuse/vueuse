<script setup lang="ts">
import { ref } from 'vue'
import { useClamp } from '@vueuse/math'
const min = ref(0)
const max = ref(10)

const value = useClamp(0, min, max)
</script>

<template>
  <div>
    min:
    <input v-model="min" type="number">
    max:
    <input v-model="max" type="number">
    value:{{ value }}
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
