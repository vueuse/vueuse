/* eslint-disable no-unused-expressions */
import { MaybeRef } from '@vueuse/shared'
import { ref, Ref } from 'vue-demi'

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
 * Output
 */
type Output<S extends Source> = S extends Ref<number>
  ? number
  : S extends Ref<number[]>
    ? number[]
    : { [K in keyof S]: number }

/**
 * Controlled output
 */
type ControlledOutput<S extends Source> = {
  output: Output<S>
}

/**
 * Transition between values
 */
export function useTransition<S extends Ref<number | number[]>>(source: S): Output<S>
export function useTransition<S extends Ref<number | number[]>>(source: S, options: ControlledOptions): ControlledOutput<S>
export function useTransition<S extends Ref<number | number[]>>(source: S, options?: Options): Output<S>
export function useTransition<S extends MaybeRef<number>[]>(source: [...S]): Output<S>
export function useTransition<S extends MaybeRef<number>[]>(source: [...S], options: ControlledOptions): ControlledOutput<S>
export function useTransition<S extends MaybeRef<number>[]>(source: [...S], options?: Options): Output<S>

export function useTransition(source: Source, options: Options = {}): any {
  // ...
}

//
// basic numbers
//
const num = useTransition(ref(1))
num // number

const controlledNum = useTransition(ref(1), { controls: true })
controlledNum.output // number

//
// array vectors
//
const arr = useTransition(ref([1, 2]))
arr // number[]

const controlledArr = useTransition(ref([1, 2]), { controls: true })
controlledArr.output // { output: number[] }

//
// tuple vectors
//
const tuple = useTransition([ref(1), 2])
tuple // [number, number]

const controlledTuple = useTransition([ref(1), 2], { controls: true })
controlledTuple.output // { output: [number, number] }
