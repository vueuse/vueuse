<script setup lang="ts">
import { usePerformanceObserver } from '@vueuse/core'
import { ref as deepRef } from 'vue'

const entrys = deepRef<PerformanceEntry[]>([])
usePerformanceObserver({
  entryTypes: ['paint'],
}, (list) => {
  entrys.value = list.getEntries()
})
function refresh() {
  return window.location.reload()
}
</script>

<template>
  <button @click="refresh">
    refresh
  </button>

  <pre lang="json">{{ entrys }}</pre>
</template>
