import { nextTick, ref } from 'vue-demi'
import { identity as linear } from '@vueuse/shared'
import { useTransition } from '../useTransition'

type TransitionTiming = [number, number, number, number] | ((n: number) => number)

/**
 * Fixed transition options
 */
type FixedTransitionOptions = {
  /**
   * Default transition duration in milliseconds
   */
  duration?: number

  /**
   * Default transition timing function
   */
  transition?: TransitionTiming
}

/**
 * Transition options
 */
type TransitionOptions<T> = {
  /**
   * Transition duration in milliseconds
   */
  duration?: number

  /**
   * Transition start value
   */
  from: T extends number ? number : number[]

  /**
   * Transition end value
   */
  to: T extends number ? number : number[]

  /**
   * Transition timing function
   */
  transition?: TransitionTiming
}

/**
 * Fixed transition from one value to another.
 */
export function useFixedTransition<T extends number | number[]>(
  initialValue: T,
  defaultOptions: FixedTransitionOptions = {},
) {
  const disabled = ref(false)
  const duration = ref(0)
  const source = ref<number | number[]>(initialValue)
  const transitionTiming = ref<TransitionTiming>(linear)

  /**
   * Transition from one value to another.
   */
  const transition = (options: TransitionOptions<T>) => {
    // set options for this transition
    duration.value = options.duration ?? defaultOptions.duration ?? 1000
    transitionTiming.value = options.transition ?? defaultOptions.transition ?? linear

    // set source to start value
    disabled.value = true
    source.value = options.from

    // execute transition
    nextTick(() => {
      disabled.value = false
      source.value = options.to
    })
  }

  const value = useTransition(source, {
    disabled,
    duration,
    transition: transitionTiming,
  })

  return {
    transition,
    value,
  }
}
