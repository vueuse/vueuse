import { toValue, useIntervalFn } from '@vueuse/shared'
import type { MaybeRefOrGetter, Pausable } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { computed, ref } from 'vue-demi'

export interface UseCountdownOptions {
  /**
   *  Interval for the countdown in milliseconds. Default is 1000ms.
   */
  interval?: MaybeRefOrGetter<number>
  /**
   * Number of times the countdown will repeat. A negative number means infinite repeats.
   */
  repeatCount?: MaybeRefOrGetter<number>
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
  remaining: Ref<number>
  /**
   * Number of times the countdown has completed.
   */
  completedCount: Ref<number>
  /**
   * Resets the countdown and repeatsLeft to their initial values.
   */
  reset: () => void
  /**
   * Stops the countdown and resets its state.
   */
  stop: () => void
  /**
   * Reset the countdown and start it again.
   */
  start: (initialCountdown?: MaybeRefOrGetter<number>) => void
}

/**
 * Wrapper for `useIntervalFn` that provides a countdown timer.
 *
 * @param initialCountdown
 * @param options
 *
 * @see https://vueuse.org/useCountdown
 */
export function useCountdown(initialCountdown: MaybeRefOrGetter<number>, options?: UseCountdownOptions): UseCountdownReturn {
  const remaining = ref(toValue(initialCountdown))
  const completedCount = ref(0)

  const repeatCompleted = computed(() => {
    if (options) {
      const repeatCount = toValue(options.repeatCount ?? 0)
      if (repeatCount > 0) {
        return completedCount.value >= repeatCount - 1
      }
    }
    return true
  })
  const intervalController = useIntervalFn(() => {
    const value = remaining.value - 1
    remaining.value = value < 0 ? 0 : value
    options?.onTick?.()
    if (remaining.value === 0) {
      if (!repeatCompleted.value) {
        remaining.value = toValue(initialCountdown)
      }
      else {
        intervalController.pause()
      }
      completedCount.value++
      options?.onComplete?.()
    }
  }, options?.interval ?? 1000, { immediate: options?.immediate ?? false })

  const reset = () => {
    remaining.value = toValue(initialCountdown)
    completedCount.value = 0
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
      else if (!repeatCompleted.value) {
        remaining.value = toValue(initialCountdown)
        intervalController.resume()
      }
    }
  }

  const start = () => {
    reset()
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
    completedCount,
  }
}
