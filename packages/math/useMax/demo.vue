<script setup lang="ts">
import { ref } from 'vue'
import { useMax } from '@vueuse/math'
const max = ref(10)

const value = useMax(0, max)
</script>

<template>
  <div>
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
