import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

export type UseArrayReducer<PV, CV, R> = (previousValue: PV, currentValue: CV, currentIndex: number) => R

export type UseArrayReduceReturn<T = any> = ComputedRef<T>

/**
 * Reactive `Array.reduce`
 *
 * @see https://vueuse.org/useArrayReduce
 * @param list - the array was called upon.
 * @param reducer - a "reducer" function.
 *
 * @returns the value that results from running the "reducer" callback function to completion over the entire array.
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useArrayReduce<T>(
  list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  reducer: UseArrayReducer<T, T, T>,
): UseArrayReduceReturn<T>

/**
 * Reactive `Array.reduce`
 *
 * @see https://vueuse.org/useArrayReduce
 * @param list - the array was called upon.
 * @param reducer - a "reducer" function.
 * @param initialValue - a value to be initialized the first time when the callback is called.
 *
 * @returns the value that results from running the "reducer" callback function to completion over the entire array.
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useArrayReduce<T, U>(
  list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  reducer: UseArrayReducer<U, T, U>,
  initialValue: MaybeRefOrGetter<U>,
): UseArrayReduceReturn<U>

/**
 * Reactive `Array.reduce`
 *
 * @see https://vueuse.org/useArrayReduce
 * @param list - the array was called upon.
 * @param reducer - a "reducer" function.
 * @param args
 *
 * @returns the value that results from running the "reducer" callback function to completion over the entire array.
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useArrayReduce<T>(
  list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  reducer: ((...p: any[]) => any),
  ...args: any[]
): UseArrayReduceReturn<T> {
  const reduceCallback = (sum: any, value: any, index: number) => reducer(toValue(sum), toValue(value), index)

  return computed(() => {
    const resolved = toValue(list)
    // Depending on the behavior of reduce, undefined is also a valid initialization value,
    // and this code will distinguish the behavior between them.
    return args.length
      ? resolved.reduce(reduceCallback, typeof args[0] === 'function' ? toValue(args[0]()) : toValue(args[0]))
      : resolved.reduce(reduceCallback)
  })
}
