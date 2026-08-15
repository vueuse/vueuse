import type { ShallowRef } from 'vue'
import type { ConfigurableScheduler } from '../_configurable'
import type { Supportable } from '../types'
import { useIntervalFn } from '@vueuse/shared'
import { shallowRef } from 'vue'
import { useSupported } from '../useSupported'

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

export interface UseMemoryOptions extends ConfigurableScheduler {
}

export interface UseMemoryReturn extends Supportable {
  memory: ShallowRef<MemoryInfo | undefined>
}

type PerformanceMemory = Performance & {
  memory: MemoryInfo
}

/**
 * Reactive Memory Info.
 *
 * @see https://vueuse.org/useMemory
 * @param options
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useMemory(options: UseMemoryOptions = {}): UseMemoryReturn {
  const memory = shallowRef<MemoryInfo>()
  const isSupported = useSupported(() => typeof performance !== 'undefined' && 'memory' in performance)

  if (isSupported.value) {
    const {
      scheduler = useIntervalFn,
    } = options

    scheduler(() => {
      memory.value = (performance as PerformanceMemory).memory
    })
  }

  return { isSupported, memory }
}
