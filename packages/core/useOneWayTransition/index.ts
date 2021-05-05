import { computed, nextTick, ref, unref } from 'vue-demi'
import { identity as linear, isNumber, noop } from '@vueuse/shared'
import { useTransition } from '../useTransition'

type TransitionTiming = [number, number, number, number] | ((n: number) => number)

/**
 * One-way transition options
 */
type OneWayTransitionOptions = {
  /**
   * Default transition duration in milliseconds
   */
  duration?: number

  /**
   * Initial value
   */
  initial?: number | number[]

  /**
   * Default transition timing function
   */
  transition?: TransitionTiming
}

/**
 * Transition options
 */
type TransitionOptions<T extends OneWayTransitionOptions> = {
  /**
   * Transition duration in milliseconds
   */
  duration?: number

  /**
   * Transition start value
   */
  from: T['initial'] extends number[] ? number [] : number

  /**
   * Transition end value
   */
  to: T['initial'] extends number[] ? number [] : number
}

/**
 * One-way transition between values.
 */
export function useOneWayTransition<T extends OneWayTransitionOptions>(defaultOptions: T) {
  let currentReject = noop
  let currentResolve = noop

  const disabled = ref(false)

  const duration = ref(0)

  const source = ref(
    Array.isArray(defaultOptions?.initial)
      ? defaultOptions.initial.slice(0)
      : isNumber(defaultOptions?.initial)
        ? defaultOptions.initial
        : 0,
  )

  const transitionTiming = computed(() => defaultOptions.transition ?? unref(defaultOptions.transition) ?? linear)

  /**
   * Transition from one value to another.
   */
  const transition = (options: TransitionOptions<T>) => {
    // reject interrupted transition
    currentReject()

    // set options for this transition
    duration.value = options.duration ?? defaultOptions.duration ?? 1000

    // set source to start value
    disabled.value = true
    source.value = options.from

    // execute transition
    nextTick(() => {
      disabled.value = false
      source.value = options.to
    })

    return new Promise<void>((resolve, reject) => {
      currentReject = reject
      currentResolve = resolve
    })
  }

  const value = useTransition(source, {
    disabled,
    duration,
    onFinished: () => currentResolve(),
    transition: transitionTiming,
  })

  return {
    transition,
    value,
  }
}
