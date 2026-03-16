import type { AnyFn, Pausable } from '@vueuse/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'
import type { ConfigurableScheduler } from '../_configurable'
import { useIntervalFn } from '@vueuse/shared'
import { shallowRef, toValue } from 'vue'

function getDefaultScheduler(options: UseCountdownOptions) {
  if ('interval' in options || 'immediate' in options) {
    const {
      interval = 1000,
      immediate = false,
    } = options

    return (cb: AnyFn) => useIntervalFn(cb, interval, { immediate })
  }

  return (cb: AnyFn) => useIntervalFn(cb, 1000, { immediate: false })
}

export interface UseCountdownOptions extends ConfigurableScheduler {
  /**
   *  Interval for the countdown in milliseconds. Default is 1000ms.
   *
   * @deprecated Please use `scheduler` option instead
   */
  interval?: MaybeRefOrGetter<number>
  /**
   * Callback function called when the countdown reaches 0.
   */
  onComplete?: () => void
  /**
   * Callback function called on each tick of the countdown.
   */
  onTick?: () => void
  /**
   * Start the countdown immediately
   *
   * @deprecated Please use `scheduler` option instead
   * @default false
   */
  immediate?: boolean
}

export interface UseCountdownReturn extends Pausable {
  /**
   * Current countdown value.
   */
  remaining: ShallowRef<number>
  /**
   * Resets the countdown and repeatsLeft to their initial values.
   */
  reset: (countdown?: MaybeRefOrGetter<number>) => void
  /**
   * Stops the countdown and resets its state.
   */
  stop: () => void
  /**
   * Reset the countdown and start it again.
   */
  start: (countdown?: MaybeRefOrGetter<number>) => void
}

/**
 * Reactive countdown timer in seconds.
 *
 * @param initialCountdown
 * @param options
 *
 * @see https://vueuse.org/useCountdown
 */
export function useCountdown(initialCountdown: MaybeRefOrGetter<number>, options: UseCountdownOptions = {}): UseCountdownReturn {
  const remaining = shallowRef(toValue(initialCountdown))

  const {
    scheduler = getDefaultScheduler(options),
    onTick,
    onComplete,
  } = options

  const controls = scheduler(() => {
    const value = remaining.value - 1
    remaining.value = value < 0 ? 0 : value
    onTick?.()
    if (remaining.value <= 0) {
      controls.pause()
      onComplete?.()
    }
  })

  const reset = (countdown?: MaybeRefOrGetter<number>) => {
    remaining.value = toValue(countdown) ?? toValue(initialCountdown)
  }

  const stop = () => {
    controls.pause()
    reset()
  }

  const resume = () => {
    if (!controls.isActive.value) {
      if (remaining.value > 0) {
        controls.resume()
      }
    }
  }

  const start = (countdown?: MaybeRefOrGetter<number>) => {
    reset(countdown)
    controls.resume()
  }

  return {
    remaining,
    reset,
    stop,
    start,
    pause: controls.pause,
    resume,
    isActive: controls.isActive,
  }
}
