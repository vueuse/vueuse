import type { AnyFn, ConfigurableScheduler, Pausable } from '@vueuse/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'
import { useIntervalFn } from '@vueuse/shared'
import { shallowRef, toValue } from 'vue'

function getDefaultScheduler(options: UseCountdownOptions<true>) {
  const {
    interval = 1000,
    immediate = false,
  } = options

  return (cb: AnyFn) => useIntervalFn(cb, interval, { immediate })
}

export interface UseCountdownOptions<Legacy = false> extends ConfigurableScheduler {
  /**
   *  Interval for the countdown in milliseconds. Default is 1000ms.
   *
   * @deprecated
   */
  interval?: Legacy extends false ? never : MaybeRefOrGetter<number>
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
   * @deprecated
   * @default false
   */
  immediate?: Legacy extends false ? never : boolean
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
export function useCountdown(initialCountdown: MaybeRefOrGetter<number>, options?: UseCountdownOptions): UseCountdownReturn
/** @deprecated Please use with `scheduler` option */
export function useCountdown(initialCountdown: MaybeRefOrGetter<number>, options: UseCountdownOptions<true>): UseCountdownReturn

export function useCountdown(initialCountdown: MaybeRefOrGetter<number>, options: UseCountdownOptions<boolean> = {}): UseCountdownReturn {
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
