<script setup lang="ts">
import { refThrottled } from '@vueuse/core'
import { shallowRef, watch } from 'vue'

const trailing = shallowRef(true)
const leading = shallowRef(false)
const input = shallowRef('')
const throttled = refThrottled(input, 1000, trailing.value, leading.value)
const updated = shallowRef(0)

watch(throttled, () => {
  updated.value += 1
})
</script>

<template>
  <div>
    <input v-model="input" placeholder="Try to type anything..." type="text">
    <note>Delay is set to 1000ms for this demo.</note>

    <p>Throttled: {{ throttled }}</p>
    <p>Times Updated: {{ updated }}</p>
    <p>Trailing: {{ trailing }}</p>
    <p>Leading: {{ leading }}</p>
  </div>
</template>
