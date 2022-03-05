<script setup lang="ts">
import { ref } from 'vue-demi'
import { watchDebounced } from '.'

const input = ref('')
const updated = ref(0)

watchDebounced(input, () => {
  updated.value += 1
}, { debounce: 1000 })
</script>

<template>
  <div>
    <input v-model="input" placeholder="Try to type anything..." type="text">
    <note>Delay is set to 1000ms for this demo.</note>

    <p>Input: {{ input }}</p>
    <p>Times Updated: {{ updated }}</p>
  </div>
</template>
