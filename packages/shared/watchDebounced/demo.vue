<script setup lang="ts">
import { ref } from 'vue'
import { watchDebounced } from '@vueuse/core'

const input = ref('')
const updated = ref(0)

watchDebounced(input, () => {
  updated.value += 1
}, { debounce: 1000, maxWait: 5000 })
</script>

<template>
  <div>
    <input v-model="input" placeholder="Try to type anything..." type="text">
    <note>Delay is set to 1000ms and maxWait is set to 5000ms for this demo.</note>

    <p>Input: {{ input }}</p>
    <p>Times Updated: {{ updated }}</p>
  </div>
</template>
