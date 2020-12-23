<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { useToggle } from '.'

const [value, toggle] = useToggle()
const value, toggle
</script>

<template>
  <div>
    <p>Value: {{ value ? 'ON' : 'OFF' }}</p>
    <button @click="toggle()">Toggle</button>
    <button @click="value = true">Set ON</button>
    <button @click="value = false">Set OFF</button>
  </div>
</template>
