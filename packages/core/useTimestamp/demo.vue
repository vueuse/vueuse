<script setup lang="ts">
import { useTimestamp } from '@vueuse/core'

const timestamp = useTimestamp()
</script>

<template>
  <div>Timestamp: {{ timestamp }}</div>
</template>
