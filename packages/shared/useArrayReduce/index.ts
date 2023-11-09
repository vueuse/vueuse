import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeRefOrGetter } from '../utils'
import { toValue } from '../toValue'

export type UseArrayReducer<PV, CV, R> = (previousValue: PV, currentValue: CV, currentIndex: number) => R

/**
 * Reactive `Array.reduce`
 *
 * @see https://vueuse.org/useArrayReduce
 * @param list - the array was called upon.
 * @param reducer - a "reducer" function.
 *
 * @returns the value that results from running the "reducer" callback function to completion over the entire array.
 */
export function useArrayReduce<T>(
  list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  reducer: UseArrayReducer<T, T, T>,
): ComputedRef<T>

/**
 * Reactive `Array.reduce`
 *
 * @see https://vueuse.org/useArrayReduce
 * @param list - the array was called upon.
 * @param reducer - a "reducer" function.
 * @param initialValue - a value to be initialized the first time when the callback is called.
 *
 * @returns the value that results from running the "reducer" callback function to completion over the entire array.
 */
export function useArrayReduce<T, U>(
  list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  reducer: UseArrayReducer<U, T, U>,
  initialValue: MaybeRefOrGetter<U>,
): ComputedRef<U>

/**
 * Reactive `Array.reduce`
 *
 * @see https://vueuse.org/useArrayReduce
 * @param list - the array was called upon.
 * @param reducer - a "reducer" function.
 * @param args
 *
 * @returns the value that results from running the "reducer" callback function to completion over the entire array.
 */
export function useArrayReduce<T>(
  list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  reducer: ((...p: any[]) => any),
  ...args: any[]
): ComputedRef<T> {
  const reduceCallback = (sum: any, value: any, index: number) => reducer(toValue(sum), toValue(value), index)

  return computed(() => {
    const resolved = toValue(list)
    // Depending on the behavior of reduce, undefined is also a valid initialization value,
    // and this code will distinguish the behavior between them.
    return args.length
      ? resolved.reduce(reduceCallback, toValue(args[0]))
      : resolved.reduce(reduceCallback)
  })
}
