import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { UseTimeoutFnOptions } from '../useTimeoutFn'
import { useTimeoutFn } from '../useTimeoutFn'
import type { Stoppable } from '../utils'
import { noop } from '../utils'

export interface UseTimeoutOptions<Controls extends boolean> extends UseTimeoutFnOptions {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls
}

/**
 * Update value after a given time with controls.
 *
 * @see   {@link https://vueuse.org/useTimeout}
 * @param interval
 * @param immediate
 */
export function useTimeout(interval?: number, options?: UseTimeoutOptions<false>): ComputedRef<boolean>
export function useTimeout(interval: number, options: UseTimeoutOptions<true>): { ready: ComputedRef<boolean> } & Stoppable
export function useTimeout(interval = 1000, options: UseTimeoutOptions<boolean> = {}) {
  const {
    controls: exposeControls = false,
  } = options

  const controls = useTimeoutFn(
    noop,
    interval,
    options,
  )

  const ready = computed(() => !controls.isPending.value)

  if (exposeControls) {
    return {
      ready,
      ...controls,
    }
  }
  else {
    return ready
  }
}
