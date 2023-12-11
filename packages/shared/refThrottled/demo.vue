<script setup lang="ts">
import { ref, watch } from 'vue'
import { refThrottled } from '@vueuse/core'

const trailing = ref(true)
const leading = ref(false)
const input = ref({
  value: '',
})
const throttled = refThrottled({
  value: input,
  delay: 1000,
  trailing: trailing.value,
  leading: leading.value,
})
const updated = ref(0)

watch(throttled, () => {
  updated.value += 1
})
</script>

<template>
  <div>
    <input v-model="input.value" placeholder="Try to type anything..." type="text">
    <note>Delay is set to 1000ms for this demo.</note>

    <p>Throttled: {{ throttled }}</p>
    <p>Times Updated: {{ updated }}</p>
    <p>Trailing: {{ trailing }}</p>
    <p>Leading: {{ leading }}</p>
  </div>
</template>
