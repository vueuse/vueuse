import { ref } from 'vue-demi'

import type { Pausable } from '@vueuse/shared'

import { useIntervalFn } from '@vueuse/shared'

export interface UseVibrateOptions {
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
   * @default [200]
   *
   */
  pattern?: number[] | number
  /**
   *
   * Interval to run a persistent vibration:
   *
   * @default 1000 (milliseconds, 1 second)
   *
   */
  interval?: | number
}

/**
 *
 * reactive useVibrate()
 *
 * @see https://vueuse.org/useVibrate
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API
 * @param options of type UseVibrateOptions
 */
export function useVibrate(options?: UseVibrateOptions) {
  const {
    pattern = [200],
    interval = 1000,
  } = options || {}

  // Is the vibration web API supported?
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator

  // Vibration pattern e.g., both number and Array<number>: 200, [200], or [200,100,200]
  const vibratePattern = ref<number[] | number>(pattern)

  // If persistent, at what interval does the
  const vibrateInterval = ref(interval)

  // Holding state for the vibrationPersistent pausable call:
  const vibrationIntervalActive = ref(false)

  const vibrationIntervalPause = ref(() => {})

  const vibrationIntervalResume = ref(() => {})

  // Attempt to start the vibration:
  const start = () => {
    if (isSupported) navigator.vibrate(vibratePattern.value)
  }

  // A persistent vibrate pausable (for dynamic vibrateInterval):
  const vibratePersistent = (): Pausable => {
    return useIntervalFn(start, vibrateInterval.value, {
      immediate: false,
      immediateCallback: false,
    })
  }

  // Attempt to stop the vibration:
  const stop = () => {
    // Stope the vibration if we need to:
    if (isSupported) navigator.vibrate(0)
    // Stop the interval if we need to:
    if (vibrationIntervalActive.value) vibrationIntervalPause.value()
  }

  // Attempt to start the vibration at a set persistent interval:
  const startPersistent = () => {
    const { isActive, pause, resume } = vibratePersistent()

    vibrationIntervalActive.value = isActive.value
    vibrationIntervalPause.value = pause
    vibrationIntervalResume.value = resume

    // If the vibration is on:
    if (!vibrationIntervalActive.value && isSupported) vibrationIntervalResume.value()
  }

  return {
    isSupported,
    pattern: vibratePattern,
    interval: vibrateInterval,
    start,
    startPersistent,
    stop,
  }
}

export type UseVibrateReturn = ReturnType<typeof useVibrate>
