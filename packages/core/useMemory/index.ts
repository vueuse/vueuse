import type { AnyFn } from '@vueuse/shared'
import type { ComputedRef, Ref } from 'vue'
import type { ConfigurableScheduler } from '../_configurable'
import { useIntervalFn } from '@vueuse/shared'
import { ref as deepRef } from 'vue'
import { useSupported } from '../useSupported'

function getDefaultScheduler(options: UseMemoryOptions<true>) {
  if ('interval' in options || 'immediate' in options || 'immediateCallback' in options) {
    const {
      interval = 1000,
      immediate,
      immediateCallback,
    } = options

    return (cb: AnyFn) => useIntervalFn(cb, interval, {
      immediate,
      immediateCallback,
    })
  }

  return useIntervalFn
}

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

export interface UseMemoryOptions<Legacy = false> extends ConfigurableScheduler {
  /**
   * Start the timer immediately
   *
   * @deprecated
   * @default true
   */
  immediate?: Legacy extends false ? never : boolean

  /**
   * Execute the callback immediately after calling `resume`
   *
   * @deprecated
   * @default false
   */
  immediateCallback?: Legacy extends false ? never : boolean

  /** @deprecated */
  interval?: Legacy extends false ? never : number
}

export interface UseMemoryReturn {
  isSupported: ComputedRef<boolean>
  memory: Ref<MemoryInfo | undefined>
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
export function useMemory(options?: UseMemoryOptions): UseMemoryReturn
/** @deprecated Please use with `scheduler` option */
export function useMemory(options: UseMemoryOptions<true>): UseMemoryReturn

export function useMemory(options: UseMemoryOptions<boolean> = {}): UseMemoryReturn {
  const memory = deepRef<MemoryInfo>()
  const isSupported = useSupported(() => typeof performance !== 'undefined' && 'memory' in performance)

  if (isSupported.value) {
    const {
      scheduler = getDefaultScheduler,
    } = options

    scheduler(() => {
      memory.value = (performance as PerformanceMemory).memory
    })
  }

  return { isSupported, memory }
}
