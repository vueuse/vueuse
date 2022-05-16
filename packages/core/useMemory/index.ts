import { ref } from 'vue-demi'
import type { IntervalFnOptions } from '@vueuse/shared'
import { useIntervalFn } from '@vueuse/shared'

/**
 * Performance.memory
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory
 */
export interface MemoryInfo {
  /**
   * The maximum size of the heap, in bytes, that is available to the context.
   */
  readonly jsHeapSizeLimit: number
  /**
   *  The total allocated heap size, in bytes.
   */
  readonly totalJSHeapSize: number
  /**
   * The currently active segment of JS heap, in bytes.
   */
  readonly usedJSHeapSize: number

  [Symbol.toStringTag]: 'MemoryInfo'
}

export interface UseMemoryOptions extends IntervalFnOptions {
  interval?: number
}

type PerformanceMemory = Performance & {
  memory: MemoryInfo
}

/**
 * Reactive Memory Info.
 *
 * @see https://vueuse.org/useMemory
 * @param options
 */
export function useMemory(options: UseMemoryOptions = {}) {
  const memory = ref<MemoryInfo>()
  const isSupported = typeof performance !== 'undefined' && 'memory' in performance

  if (isSupported) {
    const { interval = 1000 } = options
    useIntervalFn(() => {
      memory.value = (performance as PerformanceMemory).memory
    }, interval, { immediate: options.immediate, immediateCallback: options.immediateCallback })
  }

  return { isSupported, memory }
}
