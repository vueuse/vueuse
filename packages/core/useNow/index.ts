import type { AnyFn, ConfigurableScheduler, Pausable } from '@vueuse/shared'
import type { Ref } from 'vue'
import { useIntervalFn } from '@vueuse/shared'
import { ref as deepRef } from 'vue'
import { useRafFn } from '../useRafFn'

export interface UseNowOptions<Controls extends boolean> extends ConfigurableScheduler {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls
}

interface LegacyUseNowOptions<Controls extends boolean> {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls

  /**
   * Start the clock immediately
   *
   * @deprecated
   * @default true
   */
  immediate?: boolean

  /**
   * Update interval in milliseconds, or use requestAnimationFrame
   *
   * @deprecated
   * @default requestAnimationFrame
   */
  interval?: 'requestAnimationFrame' | number
}

/**
 * Reactive current Date instance.
 *
 * @see https://vueuse.org/useNow
 * @param options
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useNow(options?: UseNowOptions<false>): Ref<Date>
export function useNow(options: UseNowOptions<true>): { now: Ref<Date> } & Pausable
/** @deprecated Please use with `scheduler` option */
export function useNow(options?: LegacyUseNowOptions<false>): Ref<Date>
/** @deprecated Please use with `scheduler` option */
export function useNow(options?: LegacyUseNowOptions<true>): { now: Ref<Date> } & Pausable

/**
 * Reactive current Date instance.
 *
 * @see https://vueuse.org/useNow
 * @param options
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useNow(options: UseNowOptions<boolean> | LegacyUseNowOptions<boolean> = {}) {
  const {
    controls: exposeControls = false,
  } = options

  const now = deepRef(new Date())

  const update = () => now.value = new Date()

  const scheduler = (fn: AnyFn) => {
    if ('interval' in options || 'immediate' in options) {
      const {
        interval = 'requestAnimationFrame',
        immediate = true,
      } = options

      return interval === 'requestAnimationFrame'
        ? useRafFn(fn, { immediate })
        : useIntervalFn(fn, interval, { immediate })
    }
    else {
      return useRafFn(fn)
    }
  }

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

export type UseNowReturn = ReturnType<typeof useNow>
