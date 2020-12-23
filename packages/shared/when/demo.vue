<script setup lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { when } from '.'
import { invoke } from '../utils'
import { useCounter } from '../useCounter'

const el = ref<HTMLElement | null>(null)
      const counter = useCounter()

      invoke(async() => {
        await when(counter.count).toBe(7)

        alert('You got 7!')
      })

      const ...counter,
        el,
</script>

<template>
  <div ref="el">
    <note>Add to 7 to show the alert.</note>
    <p>Count: {{ count }}</p>
    <button @click="inc()">Increment</button>
    <button @click="dec()">Decrement</button>
  </div>
</template>
