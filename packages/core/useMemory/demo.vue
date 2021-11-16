<template>
  <div v-if="isSupported">
    <div>totalJSHeapSize:{{ memory.totalJSHeapSize }}</div>
    <div>usedJSHeapSize:{{ memory.usedJSHeapSize }}</div>
    <div>jsHeapSizeLimit:{{ memory.jsHeapSizeLimit }}</div>
  </div>
  <div v-else>
    Your browser does not support performance memory API
  </div>
</template>

<script lang="ts" setup>
import { useMemory } from '@vueuse/core'

const { isSupported, memory } = useMemory()
</script>
