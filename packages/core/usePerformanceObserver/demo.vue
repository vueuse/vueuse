<script setup lang="ts">
import { usePerformanceObserver } from '@vueuse/core'
import { shallowRef } from 'vue'

const entrys = shallowRef<PerformanceEntry[]>([])
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
