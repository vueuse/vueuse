import type { AnyFn, ConfigurableScheduler, Pausable, UseIntervalFnOptions } from '@vueuse/shared'
import type { MaybeRefOrGetter, Ref } from 'vue'
import type { UseRafFnOptions } from '../useRafFn'
import { useIntervalFn } from '@vueuse/shared'
import { ref as deepRef } from 'vue'
import { useRafFn } from '../useRafFn'

function createRafScheduler(options: UseRafFnOptions) {
  return (fn: AnyFn) => useRafFn(fn, options)
}

function createIntervalScheduler(options: { interval?: MaybeRefOrGetter<number> } & UseIntervalFnOptions) {
  return (fn: AnyFn) => useIntervalFn(fn, options.interval, options)
}

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

  let scheduler: (fn: AnyFn) => Pausable

  if ('scheduler' in options && options?.scheduler) {
    scheduler = options.scheduler
  }
  else if ('interval' in options || 'immediate' in options) {
    const {
      interval = 'requestAnimationFrame',
      immediate = true,
    } = options

    scheduler = interval === 'requestAnimationFrame'
      ? createRafScheduler({ immediate })
      : createIntervalScheduler({ interval, immediate })
  }
  else {
    scheduler = useRafFn
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
