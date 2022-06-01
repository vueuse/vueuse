<script setup lang="ts">
import { useFetch, useRetry } from '@vueuse/core'
import { ref } from 'vue'

const finalStatusCode = ref<number | null>(null)

const { onFinish } = useRetry(
  () => useFetch('https://example.com/api/users'),
  ({ statusCode }) => statusCode.value != null && statusCode.value >= 200 && statusCode.value < 300,
  { interval: 100, timeout: 1000 },
)

onFinish(({ statusCode }) => {
  finalStatusCode.value = statusCode.value
})
</script>

<template>
  <div>
    <code>{{ finalStatusCode }}</code>
  </div>
</template>
