<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import { shallowRef, watch } from 'vue'

const input = shallowRef('')
const debounced = refDebounced(input, 1000)
const updated = shallowRef(0)

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
