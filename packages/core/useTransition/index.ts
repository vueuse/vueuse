import {
  clamp,
  identity as linear,
  isFunction,
  isNumber,
  MaybeRef,
  noop,
} from '@vueuse/shared'

import {
  computed,
  ComputedRef,
  readonly,
  ref,
  Ref,
  unref,
  watch,
} from 'vue-demi'

import { useRafFn, useTimeoutFn } from '@vueuse/core'

/**
 * Cubic bezier points
 */
type CubicBezierPoints = [number, number, number, number]

/**
 * Easing function
 */
type EasingFunction = (n: number) => number

/**
 * Source
 */
type Source = Ref<number | number[]> | MaybeRef<number>[]

/**
 * Options
 */
type Options = {
  /**
   * Return transition with controls
   */
  controls?: boolean

  /**
   * Milliseconds to wait before starting transition
   */
  delay?: MaybeRef<number>

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
 * Controlled options
 */
type ControlledOptions = Options & { controls: true }

/**
 * Transition data
 */
type TransitionData = {
  currentDuration: number
  diffVector: number[]
  endAt: number
  startAt: number
  startVector: number[]
}

/**
 * Output
 */
type Output<S extends Source> = S extends Ref<number>
  ? ComputedRef<number>
  : S extends Ref<number[]>
    ? ComputedRef<number[]>
    : ComputedRef<{ [K in keyof S]: number }>

/**
 * Controlled output
 */
type OutputControls<S extends Source> = {
  /**
   * Track if the transition is paused
   */
  isPaused: ComputedRef<boolean>

  /**
   * Track if a transition is running
   */
  isTransitioning: Ref<boolean>

  /**
   * Transitioned output value
   */
  output: Output<S>

  /**
   * Pause the transition
   */
  pause: () => void

  /**
   * Resume a paused transition
   */
  resume: () => void
}

/**
 * Params needed to create output controls
 */
type OutputControlParams<S extends Source> = {
  data: TransitionData
  isTransitioning: Ref<boolean>
  output: Output<S>
  pause: () => void
  pausedAt: Ref<number>
  resume: () => void
}

/**
 * Common transitions
 *
 * @see   {@link https://easings.net}
 */
export const TransitionPresets: Record<string, CubicBezierPoints | EasingFunction> = {
  linear,
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

  return (x: number) => p0 === p1 && p2 === p3 ? x : calcBezier(getTforX(x), p1, p3)
}

/**
 * Transition between values
 */
export function useTransition<S extends Ref<number | number[]>>(source: S): Output<S>
export function useTransition<S extends Ref<number | number[]>>(source: S, options: ControlledOptions): OutputControls<S>
export function useTransition<S extends Ref<number | number[]>>(source: S, options?: Options): Output<S>
export function useTransition<S extends MaybeRef<number>[]>(source: [...S]): Output<S>
export function useTransition<S extends MaybeRef<number>[]>(source: [...S], options: ControlledOptions): OutputControls<S>
export function useTransition<S extends MaybeRef<number>[]>(source: [...S], options?: Options): Output<S>

export function useTransition(source: Source, options: Options = {}): any {
  const {
    controls = false,
    delay = 0,
    duration = 1000,
    onFinished = noop,
    onStarted = noop,
    transition = linear,
  } = options

  // current easing function
  const currentTransition = computed(() => {
    const t = unref(transition)
    return isFunction(t) ? t : createEasingFunction(t)
  })

  // tracks if a transition is running
  const isTransitioning = controls ? ref(false) : null

  // time the transition was paused
  const pausedAt = controls ? ref(0) : null

  // raw source value
  const sourceValue = computed(() => {
    const s = unref(source)
    return isNumber(s) ? s : s.map(unref) as number[]
  })

  // normalized source vector
  const sourceVector = computed(() => isNumber(sourceValue.value) ? [sourceValue.value] : sourceValue.value)

  // transitioned output vector
  const outputVector = ref(sourceVector.value.slice(0))

  // transition data
  const data: TransitionData = {
    currentDuration: 0,
    diffVector: [],
    endAt: 0,
    startAt: 0,
    startVector: [],
  }

  // requestAnimationFrame loop
  const { resume, pause } = useRafFn(() => {
    const now = Date.now()
    const progress = clamp(1 - ((data.endAt - now) / data.currentDuration), 0, 1)

    outputVector.value = data.startVector.map((val, i) => val + ((data.diffVector[i] ?? 0) * currentTransition.value(progress)))

    if (progress >= 1) {
      pause()

      if (controls) isTransitioning!.value = false

      onFinished()
    }
  }, { immediate: false })

  // start the animation loop when source vector changes
  const start = () => {
    pause()

    data.currentDuration = unref(duration)
    data.diffVector = outputVector.value.map((n, i) => (sourceVector.value[i] ?? 0) - (outputVector.value[i] ?? 0))
    data.startVector = outputVector.value.slice(0)
    data.startAt = Date.now()
    data.endAt = data.startAt + data.currentDuration

    resume()

    if (controls) {
      isTransitioning!.value = true
      pausedAt!.value = 0
    }

    onStarted()
  }

  // timeout start for delayed transitions
  const timeout = useTimeoutFn(start, delay, false)

  // watch source value for changes
  watch(sourceVector, () => {
    if (unref(delay) <= 0) start()
    else timeout.start()
  }, { deep: true })

  // transitioned output value
  const output = computed(() => isNumber(sourceValue.value) ? outputVector.value[0] : outputVector.value) as Output<typeof source>

  // and finally, return the output controls or raw output
  return controls
    ? outputControls({
      data,
      isTransitioning: isTransitioning as Ref<boolean>,
      output,
      pause,
      pausedAt: pausedAt as Ref<number>,
      resume,
    })
    : output
}

/**
 * Create output controls object
 */
function outputControls<S extends Source>(params: OutputControlParams<S>): OutputControls<S> {
  const { data, isTransitioning, output, pause, pausedAt, resume } = params
  const isPaused = computed(() => isTransitioning.value && pausedAt.value > 0)
  let timeRemaining = 0

  return {
    isPaused,
    isTransitioning: readonly(isTransitioning),
    output,
    pause: () => {
      if (!isPaused.value && isTransitioning.value) {
        pausedAt.value = Date.now()
        timeRemaining = data.endAt - pausedAt.value
        pause()
      }
    },
    resume: () => {
      if (isPaused.value && isTransitioning.value) {
        pausedAt.value = 0
        data.endAt = Date.now() + timeRemaining
        resume()
      }
    },
  }
}
