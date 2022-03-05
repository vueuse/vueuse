<script setup lang="ts">
import { ref, watch } from 'vue'
import { refDebounced } from '@vueuse/core'

const input = ref('')
const debounced = refDebounced(input, 1000)
const updated = ref(0)

watch(debounced, () => (updated.value += 1))
</script>

<template>
  <div>
    <input v-model="input" placeholder="Try to type anything..." type="text">
    <note>Delay is set to 1000ms for this demo.</note>

    <p>Debounced: {{ debounced }}</p>
    <p>Times Updated: {{ updated }}</p>
  </div>
</template>
