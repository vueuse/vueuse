import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import type { MaybeComputedRef, Pausable } from '../utils'
import { useIntervalFn } from '../useIntervalFn'

export interface UseIntervalOptions<Controls extends boolean> {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls

  /**
   * Execute the update immediately on calling
   *
   * @default true
   */
  immediate?: boolean
  /**
   * Callback on every interval
   */
  callback?: (count: number) => void
}

/**
 * Reactive counter increases on every interval
 *
 * @see https://vueuse.org/useInterval
 * @param interval
 * @param options
 */
export function useInterval(interval?: MaybeComputedRef<number>, options?: UseIntervalOptions<false>): Ref<number>
export function useInterval(interval: MaybeComputedRef<number>, options: UseIntervalOptions<true>): { counter: Ref<number> } & Pausable
export function useInterval(interval: MaybeComputedRef<number> = 1000, options: UseIntervalOptions<boolean> = {}) {
  const {
    controls: exposeControls = false,
    immediate = true,
    callback,
  } = options

  const counter = ref(0)
  const update = () => counter.value += 1
  const controls = useIntervalFn(callback
    ? () => {
        update()
        callback(counter.value)
      }
    : update, interval, { immediate })

  if (exposeControls) {
    return {
      counter,
      ...controls,
    }
  }
  else {
    return counter
  }
}
