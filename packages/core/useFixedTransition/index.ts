import { nextTick, ref } from 'vue-demi'
import { identity as linear, noop } from '@vueuse/shared'
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
type TransitionOptions<T, U = T extends number ? number : number[]> = {
  /**
   * Transition duration in milliseconds
   */
  duration?: number

  /**
   * Transition start value
   */
  from: U

  /**
   * Transition end value
   */
  to: U

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
  let currentReject = noop
  let currentResolve = noop

  const disabled = ref(false)
  const duration = ref(0)
  const source = ref<number | number[]>(initialValue)
  const transitionTiming = ref<TransitionTiming>(linear)

  /**
   * Transition from one value to another.
   */
  const transition = (options: TransitionOptions<T>) => {
    // reject interrupted transition
    currentReject()

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
