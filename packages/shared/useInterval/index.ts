import type { Ref } from 'vue-demi'
import type { MaybeRefOrGetter, Pausable } from '../utils'
import { ref } from 'vue-demi'
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
   * Increase step, need to bigger or less than 0
   *
   * @default 1
   */
  step?: number

  /**
   * Callback on every interval
   */
  callback?: (count: number) => void
}

export interface UseIntervalControls {
  counter: Ref<number>
  reset: () => void
}

/**
 * Reactive counter increases on every interval
 *
 * @see https://vueuse.org/useInterval
 * @param interval
 * @param options
 */
export function useInterval(interval?: MaybeRefOrGetter<number>, options?: UseIntervalOptions<false>): Ref<number>
export function useInterval(interval: MaybeRefOrGetter<number>, options: UseIntervalOptions<true>): UseIntervalControls & Pausable
export function useInterval(interval: MaybeRefOrGetter<number> = 1000, options: UseIntervalOptions<boolean> = {}) {
  const {
    controls: exposeControls = false,
    immediate = true,
    step = 1,
    callback,
  } = options

  const counter = ref(0)
  const update = () => counter.value += step
  const reset = () => {
    counter.value = 0
  }
  const controls = useIntervalFn(
    callback
      ? () => {
          update()
          callback(counter.value)
        }
      : update,
    interval,
    { immediate },
  )

  if (exposeControls) {
    return {
      counter,
      reset,
      ...controls,
    }
  }
  else {
    return counter
  }
}
