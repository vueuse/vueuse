import type { MaybeComputedRef } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { resolveUnref } from '@vueuse/shared'
import { computed } from 'vue-demi'

export type UseArrayReducer<PV, CV, R> = (previousValue: PV, currentValue: CV, currentIndex: number) => R

export function useArrayReduce<T>(
  list: MaybeComputedRef<MaybeComputedRef<T>[]>,
  reducer: UseArrayReducer<T, T, T>,
): ComputedRef<T>

export function useArrayReduce<T, U>(
  list: MaybeComputedRef<MaybeComputedRef<T>[]>,
  reducer: UseArrayReducer<U, T, U>,
  initialValue: MaybeComputedRef<U>,
): ComputedRef<U>

/**
 * Reactive `Array.reduce`
 *
 * @see https://vueuse.org/useArrayReduce
 */
export function useArrayReduce<T>(
  list: MaybeComputedRef<MaybeComputedRef<T>[]>,
  reducer: ((...p: any[]) => any),
  ...args: any[]
): ComputedRef<T> {
  const reduceCallback = (sum: any, value: any, index: number) => reducer(resolveUnref(sum), resolveUnref(value), index)

  return computed(() => {
    const resolved = resolveUnref(list)
    // Depending on the behavior of reduce, undefined is also a valid initialization value,
    // and this code will distinguish the behavior between them.
    return args.length
      ? resolved.reduce(reduceCallback, resolveUnref(args[0]))
      : resolved.reduce(reduceCallback)
  })
}
