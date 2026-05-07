import type { AnyFn, Pausable } from '@vueuse/shared'
import type { ShallowRef } from 'vue'
import type { ConfigurableScheduler } from '../_configurable'
import { useIntervalFn } from '@vueuse/shared'
import { shallowRef } from 'vue'
import { useRafFn } from '../useRafFn'

function getDefaultScheduler(options: UseNowOptions<boolean>) {
  if ('interval' in options || 'immediate' in options) {
    const {
      interval = 'requestAnimationFrame',
      immediate = true,
    } = options

    return interval === 'requestAnimationFrame'
      ? (fn: AnyFn) => useRafFn(fn, { immediate })
      : (fn: AnyFn) => useIntervalFn(fn, interval, options)
  }

  return useRafFn
}

export interface UseNowOptions<Controls extends boolean> extends ConfigurableScheduler {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls

  /**
   * Start the clock immediately
   *
   * @deprecated Please use `scheduler` option instead
   * @default true
   */
  immediate?: boolean

  /**
   * Update interval in milliseconds, or use requestAnimationFrame
   *
   * @deprecated Please use `scheduler` option instead
   * @default requestAnimationFrame
   */
  interval?: 'requestAnimationFrame' | number
}

export type UseNowReturn<Controls extends boolean> = Controls extends true ? ({ now: ShallowRef<Date> } & Pausable) : ShallowRef<Date>

/**
 * Reactive current Date instance.
 *
 * @see https://vueuse.org/useNow
 * @param options
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useNow(options?: UseNowOptions<false>): ShallowRef<Date>
export function useNow(options: UseNowOptions<true>): { now: ShallowRef<Date> } & Pausable

/**
 * Reactive current Date instance.
 *
 * @see https://vueuse.org/useNow
 * @param options
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useNow(options: UseNowOptions<boolean> = {}): UseNowReturn<boolean> {
  const {
    controls: exposeControls = false,
    scheduler = getDefaultScheduler(options),
  } = options

  const now = shallowRef(new Date())

  const update = () => now.value = new Date()

  const controls = scheduler(update)

  if (exposeControls) {
    return {
      now,
      ...controls,
    }
  }
  else {
    return now
  }
}
