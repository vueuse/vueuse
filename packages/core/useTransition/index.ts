import { computed, ref, unref, watch } from 'vue-demi'
import { isFunction, isNumber, identity as linear, promiseTimeout, resolveUnref, tryOnScopeDispose } from '@vueuse/shared'
import type { ComputedRef, Ref } from 'vue-demi'
import type { MaybeComputedRef, MaybeRef } from '@vueuse/shared'

/**
 * Cubic bezier points
 */
export type CubicBezierPoints = [number, number, number, number]

/**
 * Easing function
 */
export type EasingFunction = (n: number) => number

/**
 * Transition options
 */
export interface TransitionOptions {

  /**
   * Manually abort a transition
   */
  abort?: () => any

  /**
   * Transition duration in milliseconds
   */
  duration?: MaybeRef<number>

  /**
   * Easing function or cubic bezier points for calculating transition values
   */
  transition?: MaybeRef<EasingFunction | CubicBezierPoints>
}

export interface UseTransitionOptions extends TransitionOptions {
  /**
   * Milliseconds to wait before starting transition
   */
  delay?: MaybeRef<number>

  /**
   * Disables the transition
   */
  disabled?: MaybeRef<boolean>

  /**
   * Callback to execute after transition finishes
   */
  onFinished?: () => void

  /**
   * Callback to execute after transition starts
   */
  onStarted?: () => void
}

const _TransitionPresets = {
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
} as const

/**
 * Common transitions
 *
 * @see https://easings.net
 */
export const TransitionPresets = /* #__PURE__ */ Object.assign({}, { linear }, _TransitionPresets) as Record<keyof typeof _TransitionPresets, CubicBezierPoints> & { linear: EasingFunction }

/**
 * Create an easing function from cubic bezier points.
 */
function createEasingFunction([p0, p1, p2, p3]: CubicBezierPoints): EasingFunction {
  const a = (a1: number, a2: number) => 1 - 3 * a2 + 3 * a1
  const b = (a1: number, a2: number) => 3 * a2 - 6 * a1
  const c = (a1: number) => 3 * a1

  const calcBezier = (t: number, a1: number, a2: number) => ((a(a1, a2) * t + b(a1, a2)) * t + c(a1)) * t

  const getSlope = (t: number, a1: number, a2: number) => 3 * a(a1, a2) * t * t + 2 * b(a1, a2) * t + c(a1)

  const getTforX = (x: number) => {
    let aGuessT = x

    for (let i = 0; i < 4; ++i) {
      const currentSlope = getSlope(aGuessT, p0, p2)
      if (currentSlope === 0)
        return aGuessT
      const currentX = calcBezier(aGuessT, p0, p2) - x
      aGuessT -= currentX / currentSlope
    }

    return aGuessT
  }

  return (x: number) => (p0 === p1 && p2 === p3) ? x : calcBezier(getTforX(x), p1, p3)
}

const lerp = (a: number, b: number, alpha: number) => a + alpha * (b - a)

const toVec = (t: number | number[] | undefined) => (isNumber(t) ? [t] : t) || []

/**
 * Transition from one value to another.
 *
 * @param source
 * @param from
 * @param to
 * @param options
 */
export function executeTransition<T extends number | number[]>(
  source: Ref<T>,
  from: MaybeRef<T>,
  to: MaybeRef<T>,
  options: TransitionOptions = {},
): PromiseLike<void> {
  const fromVal = unref(from)
  const toVal = unref(to)
  const v1 = toVec(fromVal)
  const v2 = toVec(toVal)
  const duration = unref(options.duration) ?? 1000
  const startedAt = Date.now()
  const endAt = Date.now() + duration
  const trans = unref(options.transition) ?? linear

  const ease = isFunction(trans) ? trans : createEasingFunction(trans)

  return new Promise<void>((resolve) => {
    source.value = fromVal

    const tick = () => {
      if (options.abort?.()) {
        resolve()

        return
      }

      const now = Date.now()
      const alpha = ease((now - startedAt) / duration)
      const arr = toVec(source.value).map((n, i) => lerp(v1[i], v2[i], alpha))

      if (Array.isArray(source.value))
        (source.value as number[]) = arr.map((n, i) => lerp(v1[i] ?? 0, v2[i] ?? 0, alpha))
      else if (isNumber(source.value))
        (source.value as number) = arr[0]

      if (now < endAt) {
        requestAnimationFrame(tick)
      }
      else {
        source.value = toVal

        resolve()
      }
    }

    tick()
  })
}

// option 1: reactive number
export function useTransition(source: MaybeComputedRef<number>, options?: UseTransitionOptions): ComputedRef<number>

// option 2: static array of possibly reactive numbers
export function useTransition<T extends MaybeComputedRef<number>[]>(source: [...T], options?: UseTransitionOptions): ComputedRef<{ [K in keyof T]: number }>

// option 3: reactive array of numbers
export function useTransition<T extends MaybeComputedRef<number[]>>(source: T, options?: UseTransitionOptions): ComputedRef<number[]>

/**
 * Follow value with a transition.
 *
 * @see https://vueuse.org/useTransition
 * @param source
 * @param options
 */
export function useTransition(
  source: MaybeComputedRef<number | number[]> | MaybeComputedRef<number>[],
  options: UseTransitionOptions = {},
): Ref<any> {
  let currentId = 0

  const sourceVal = () => {
    const v = resolveUnref(source)

    return isNumber(v) ? v : v.map(resolveUnref<number>)
  }

  const outputRef = ref(sourceVal())

  watch(sourceVal, async (to) => {
    if (unref(options.disabled))
      return

    const id = ++currentId

    if (options.delay)
      await promiseTimeout(unref(options.delay))

    if (id !== currentId)
      return

    const toVal = Array.isArray(to) ? to.map(resolveUnref<number>) : resolveUnref(to)

    options.onStarted?.()

    await executeTransition(outputRef, outputRef.value, toVal, {
      ...options,
      abort: () => id !== currentId || options.abort?.(),
    })

    options.onFinished?.()
  }, { deep: true })

  watch(() => unref(options.disabled), (disabled) => {
    if (disabled) {
      currentId++

      outputRef.value = sourceVal()
    }
  })

  tryOnScopeDispose(() => {
    currentId++
  })

  return computed(() => unref(options.disabled) ? sourceVal() : outputRef.value)
}
