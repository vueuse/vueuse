import type { ConfigurableScheduler, DEPRECATE_SCHEDULER_INTERVAL, Pausable } from '@vueuse/shared'
import type { MaybeRefOrGetter, Ref } from 'vue'
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
/** @deprecated The option `interval: 'requestAnimationFrame'` has been deprecated. Please use the `scheduler` option with`useRafFn` instead */
export function useNow(options: DEPRECATE_SCHEDULER_INTERVAL<UseNowOptions<boolean>>): Ref<Date> | ({ now: Ref<Date> } & Pausable)

/**
 * Reactive current Date instance.
 *
 * @see https://vueuse.org/useNow
 * @param options
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useNow(options: UseNowOptions<boolean> | DEPRECATE_SCHEDULER_INTERVAL<UseNowOptions<boolean>> = {}) {
  const {
    controls: exposeControls = false,
    scheduler = (options.interval === undefined || options.interval === 'requestAnimationFrame') ? useRafFn : useIntervalFn,
    interval,
    immediate = true,
    immediateCallback,
  } = options

  const now = deepRef(new Date())

  const update = () => now.value = new Date()

  const controls: Pausable = scheduler(update, {
    interval: interval as MaybeRefOrGetter<number>,
    immediate,
    immediateCallback,
  })

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
