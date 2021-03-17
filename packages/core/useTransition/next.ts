import { computed, ComputedRef, ref, Ref, unref } from 'vue-demi'
import { isNumber, MaybeRef } from '@vueuse/shared'

/**
 * Cubic bezier points
 */
type CubicBezierPoints = [number, number, number, number]

/**
 * Easing function
 */
type EasingFunction = (n: number) => number

/**
 * Transition options
 */
export type TransitionOptions = {
  /**
   * Transition duration in milliseconds
   */
  duration?: MaybeRef<number>

  /**
   * Callback to execute after transition finishes
   */
  onFinished?: () => void

  /**
   * Callback to execute after transition starts
   */
  onStarted?: () => void

  /**
   * Easing function or cubic bezier points for calculating transition values
   */
  transition?: MaybeRef<EasingFunction | CubicBezierPoints>
}

// option 1: reactive number
export function useTransition(source: Ref<number>, options?: TransitionOptions): ComputedRef<number>

// option 2: static array of possibly reactive numbers
export function useTransition<T extends MaybeRef<number>[]>(source: [...T], options?: TransitionOptions): ComputedRef<{ [K in keyof T]: number }>

// option 3: reactive array of numbers
export function useTransition<T extends Ref<number[]>>(source: T, options?: TransitionOptions): ComputedRef<number[]>

/**
 * Transition between values.
 */
export function useTransition(
  source: Ref<number> | MaybeRef<number>[] | Ref<number[]>,
  options: TransitionOptions = {},
): ComputedRef<number | { [K in keyof typeof source]: number } | number[]> {
  // raw source value
  const sourceValue = computed(() => {
    const s = unref(source)
    return isNumber(s) ? s : s.map(unref) as number[]
  })

  // normalized source vector
  const sourceVector = computed(() => isNumber(sourceValue.value) ? [sourceValue.value] : sourceValue.value)

  return computed(() => isNumber(sourceValue.value) ? sourceVector.value[0] : sourceVector.value)
}

/* eslint-disable no-unused-expressions */
// option 1: number
useTransition(ref(1)).value

// option 2: [number, number, number]
useTransition([1, ref(2), computed(() => 2)]).value

// option 3: number[]
useTransition(ref([1, 2, 3])).value
