import type { AnyFn, Arrayable, Pausable } from '@vueuse/shared'
import type { MaybeRefOrGetter } from 'vue'
import type { ConfigurableNavigator, ConfigurableScheduler } from '../_configurable'
import type { Supportable } from '../types'
import { toRef, useIntervalFn } from '@vueuse/shared'
import { defaultNavigator } from '../_configurable'
import { useSupported } from '../useSupported'

function getDefaultScheduler(options: UseVibrateOptions = { interval: 0 }) {
  const {
    interval,
  } = options

  if (interval === 0)
    return

  return (fn: AnyFn) => useIntervalFn(fn, interval, {
    immediate: false,
    immediateCallback: false,
  })
}

export interface UseVibrateOptions extends ConfigurableNavigator, ConfigurableScheduler {
  /**
   *
   * Vibration Pattern
   *
   * An array of values describes alternating periods in which the
   * device is vibrating and not vibrating. Each value in the array
   * is converted to an integer, then interpreted alternately as
   * the number of milliseconds the device should vibrate and the
   * number of milliseconds it should not be vibrating
   *
   * @default []
   *
   */
  pattern?: MaybeRefOrGetter<Arrayable<number>>
  /**
   * Interval to run a persistent vibration, in ms
   *
   * Pass `0` to disable
   *
   * @deprecated Please use `scheduler` option instead
   * @default 0
   *
   */
  interval: number
}

export interface UseVibrateReturn extends Supportable {
  pattern: MaybeRefOrGetter<Arrayable<number>>
  intervalControls?: Pausable
  vibrate: (pattern?: Arrayable<number>) => void
  stop: () => void
}

/**
 * Reactive vibrate
 *
 * @see https://vueuse.org/useVibrate
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API
 * @param options
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useVibrate(options?: UseVibrateOptions): UseVibrateReturn {
  const {
    pattern = [],
    scheduler = getDefaultScheduler(options),
    navigator = defaultNavigator,
  } = options || {}

  const isSupported = useSupported(() => typeof navigator !== 'undefined' && 'vibrate' in navigator)

  const patternRef = toRef(pattern)

  const vibrate = (pattern = patternRef.value) => {
    if (isSupported.value)
      navigator!.vibrate(pattern)
  }

  const intervalControls = scheduler?.(vibrate)

  // Attempt to stop the vibration:
  const stop = () => {
    // Stope the vibration if we need to:
    if (isSupported.value)
      navigator!.vibrate(0)
    intervalControls?.pause()
  }

  return {
    isSupported,
    pattern,
    intervalControls,
    vibrate,
    stop,
  }
}
