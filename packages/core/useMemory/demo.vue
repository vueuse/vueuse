<template>
  <div>totalJSHeapSize:{{ memory.totalJSHeapSize }}</div>
  <div>usedJSHeapSize:{{ memory.usedJSHeapSize }}</div>
  <div>jsHeapSizeLimit:{{ memory.jsHeapSizeLimit }}</div>
</template>

<script lang="ts" setup>
import { useMemory } from '@vueuse/core'

const memory = useMemory()
</script>
