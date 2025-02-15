<script setup lang="ts">
import { useClamp } from '@vueuse/math'
import { shallowRef } from 'vue'

const min = shallowRef(0)
const max = shallowRef(10)

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
