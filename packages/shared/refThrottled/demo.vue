<script setup lang="ts">
import { ref, watch } from 'vue'
import { refThrottled } from '@vueuse/core'

const trailing = ref(true)
const leading = ref(false)
const input = ref('')
const throttled = refThrottled(input, 1000, trailing.value, leading.value)
const updated = ref(0)

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
