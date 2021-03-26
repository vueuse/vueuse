<script setup lang="ts">
import { ref } from 'vue-demi'
import { throttledWatch } from '.'

const input = ref('')
const updated = ref(0)

throttledWatch(input, () => {
  updated.value += 1
}, { throttle: 500 })
</script>

<template>
  <div>
    <input v-model="input" placeholder="Try to type anything..." type="text">
    <note>Delay is set to 1000ms for this demo.</note>

    <p>Input: {{ input }}</p>
    <p>Times Updated: {{ updated }}</p>
  </div>
</template>
