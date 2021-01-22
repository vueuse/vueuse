<script setup lang="ts">
import { ref } from 'vue-demi'
import { when } from '.'
import { invoke } from '../utils'
import { useCounter } from '../useCounter'

const { count, inc, dec } = useCounter()

invoke(async() => {
  await when(count).toBe(7)

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
