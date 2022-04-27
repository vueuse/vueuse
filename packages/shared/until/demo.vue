<script setup lang="ts">
import { until, useCounter } from '@vueuse/shared'
import { invoke } from '../utils'

const { count, inc, dec } = useCounter()

invoke(async() => {
  await until(count).toBe(7)

  alert('You got 7!')
})
</script>

<template>
  <note>Add to 7 to show the alert.</note>
  <p>Count: {{ count }}</p>
  <button @click="inc()">
    Increment
  </button>
  <button @click="dec()">
    Decrement
  </button>
</template>
