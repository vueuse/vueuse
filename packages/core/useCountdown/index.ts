import type { Pausable } from '@vueuse/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'
import { useIntervalFn } from '@vueuse/shared'
import { shallowRef, toValue } from 'vue'

export interface UseCountdownOptions {
  /**
   *  Interval for the countdown in milliseconds. Default is 1000ms.
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
 * Wrapper for `useIntervalFn` that provides a countdown timer in seconds.
 *
 * @param initialCountdown
 * @param options
 *
 * @see https://vueuse.org/useCountdown
 */
export function useCountdown(initialCountdown: MaybeRefOrGetter<number>, options?: UseCountdownOptions): UseCountdownReturn {
  const remaining = shallowRef(toValue(initialCountdown))

  const intervalController = useIntervalFn(() => {
    const value = remaining.value - 1
    remaining.value = value < 0 ? 0 : value
    options?.onTick?.()
    if (remaining.value <= 0) {
      intervalController.pause()
      options?.onComplete?.()
    }
  }, options?.interval ?? 1000, { immediate: options?.immediate ?? false })

  const reset = (countdown?: MaybeRefOrGetter<number>) => {
    remaining.value = toValue(countdown) ?? toValue(initialCountdown)
  }

  const stop = () => {
    intervalController.pause()
    reset()
  }

  const resume = () => {
    if (!intervalController.isActive.value) {
      if (remaining.value > 0) {
        intervalController.resume()
      }
    }
  }

  const start = (countdown?: MaybeRefOrGetter<number>) => {
    reset(countdown)
    intervalController.resume()
  }

  return {
    remaining,
    reset,
    stop,
    start,
    pause: intervalController.pause,
    resume,
    isActive: intervalController.isActive,
  }
}
