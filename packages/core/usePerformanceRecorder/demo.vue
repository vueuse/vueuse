<script setup lang="ts">
import { usePerformanceRecorder } from '@vueuse/core'
const recorderInfo = usePerformanceRecorder()
</script>

<template>
  <pre lang="json">{{ recorderInfo }}</pre>
</template>
