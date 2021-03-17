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

/**
 * Common transitions
 *
 * @see   {@link https://easings.net}
 */
export const TransitionPresets: Record<string, CubicBezierPoints> = {
  linear: [0, 0, 1, 1],
  easeInSine: [0.12, 0, 0.39, 0],
  easeOutSine: [0.61, 1, 0.88, 1],
  easeInOutSine: [0.37, 0, 0.63, 1],
  easeInQuad: [0.11, 0, 0.5, 0],
  easeOutQuad: [0.5, 1, 0.89, 1],
  easeInOutQuad: [0.45, 0, 0.55, 1],
  easeInCubic: [0.32, 0, 0.67, 0],
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  easeInQuart: [0.5, 0, 0.75, 0],
  easeOutQuart: [0.25, 1, 0.5, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  easeInQuint: [0.64, 0, 0.78, 0],
  easeOutQuint: [0.22, 1, 0.36, 1],
  easeInOutQuint: [0.83, 0, 0.17, 1],
  easeInExpo: [0.7, 0, 0.84, 0],
  easeOutExpo: [0.16, 1, 0.3, 1],
  easeInOutExpo: [0.87, 0, 0.13, 1],
  easeInCirc: [0.55, 0, 1, 0.45],
  easeOutCirc: [0, 0.55, 0.45, 1],
  easeInOutCirc: [0.85, 0, 0.15, 1],
  easeInBack: [0.36, 0, 0.66, -0.56],
  easeOutBack: [0.34, 1.56, 0.64, 1],
  easeInOutBack: [0.68, -0.6, 0.32, 1.6],
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
