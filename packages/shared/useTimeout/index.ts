import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { UseTimeoutFnOptions } from '../useTimeoutFn'
import type { Fn, Stoppable } from '../utils'
import { computed } from 'vue'
import { useTimeoutFn } from '../useTimeoutFn'
import { noop } from '../utils'

export interface UseTimeoutOptions<Controls extends boolean> extends UseTimeoutFnOptions {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls
  /**
   * Callback on timeout
   */
  callback?: Fn
}

export type UseTimeoutReturn = ComputedRef<boolean> | { readonly ready: ComputedRef<boolean> } & Stoppable
/**
 * @deprecated use UseTimeoutReturn instead
 */
export type UseTimoutReturn = UseTimeoutReturn

/**
 * Update value after a given time with controls.
 *
 * @see   {@link https://vueuse.org/useTimeout}
 * @param interval
 * @param options
 */
export function useTimeout(interval?: MaybeRefOrGetter<number>, options?: UseTimeoutOptions<false>): ComputedRef<boolean>
export function useTimeout(interval: MaybeRefOrGetter<number>, options: UseTimeoutOptions<true>): { ready: ComputedRef<boolean> } & Stoppable
export function useTimeout(interval: MaybeRefOrGetter<number> = 1000, options: UseTimeoutOptions<boolean> = {}): UseTimeoutReturn {
  const {
    controls: exposeControls = false,
    callback,
  } = options

  const controls = useTimeoutFn(
    callback ?? noop,
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
