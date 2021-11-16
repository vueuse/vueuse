import { ref, Ref } from 'vue-demi'
import { useIntervalFn } from '@vueuse/core'

interface Memory {
  jsHeapSizeLimit: number
  totalJSHeapSize: number
  usedJSHeapSize: number
}

type PerformanceMemory = Performance & {
  memory: Memory
}

export function useMemory() {
  const memory = ref() as Ref<Memory>
  const isSupported = performance && 'memory' in performance

  if (isSupported) {
    useIntervalFn(() => {
      memory.value = (performance as PerformanceMemory).memory
    }, 1000, { immediate: true, immediateCallback: true })
  }

  return { isSupported, memory }
}
