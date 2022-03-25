<script setup lang="ts">
import { useNow } from '@vueuse/core'

const now = useNow()
</script>

<template>
  <div>Now: {{ now }}</div>
</template>
