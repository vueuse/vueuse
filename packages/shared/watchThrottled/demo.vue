<script setup lang="ts">
import { watchThrottled } from '@vueuse/core'
import { shallowRef } from 'vue'

const input = shallowRef('')
const updated = shallowRef(0)

watchThrottled(input, () => {
  updated.value += 1
}, { throttle: 1000 })
</script>

<template>
  <div>
    <input v-model="input" placeholder="Try to type anything..." type="text">
    <note>Delay is set to 1000ms for this demo.</note>

    <p>Input: {{ input }}</p>
    <p>Times Updated: {{ updated }}</p>
  </div>
</template>
