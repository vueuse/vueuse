import { MaybeRef, IntervalFnReturn, useIntervalFn } from '@vueuse/shared'
import { computed, unref, watch } from 'vue-demi'
import { ConfigurableNavigator, defaultNavigator } from '../_configurable'

export interface VibrateOptions extends ConfigurableNavigator {
  /**
   * Vibration Pattern
   *
   * @default [1000, 1000]
   */
  pattern?: VibratePattern

  /**
   * Infinitely continue the vibrations
   *
   * @default true
   */
  loop?: boolean
}

export interface UseVibrateReturn extends IntervalFnReturn {
  isSupported: boolean
}

/**
 * Reactive Vibration API.
 *
 * @see https://vueuse.org/useVibrate
 * @param enabled
 * @param options
 */
export function useVibrate(
  enabled: MaybeRef<boolean | undefined> = false,
  options: VibrateOptions = {},
): UseVibrateReturn {
  const {
    navigator = defaultNavigator,
    pattern = [1000, 1000],
    loop = true,
  } = options
  const isSupported = Boolean(navigator && 'vibrate' in navigator)
  const vibrate = computed(() => unref(enabled))
  const duration = pattern instanceof Array ? pattern.reduce((a, b) => a + b) : (pattern as number)
  const controls = useIntervalFn(() => {
    navigator!.vibrate(pattern)
  }, duration, false)

  watch(() => vibrate.value, () => {
    if (vibrate.value) {
      navigator!.vibrate(pattern)
      if (loop) controls.resume()
    }
    else {
      navigator!.vibrate(0)
      controls.pause()
    }
  })

  return {
    ...controls,
    isSupported,
  }
}
