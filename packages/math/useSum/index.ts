import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'

export type UseSumAdder<PV, CV, R> = (previousValue: PV, currentValue: CV, currentIndex: number) => R

export function useSum<T>(
  list: MaybeComputedRef<MaybeComputedRef<T>[]>,
  adder?: UseSumAdder<T, T, T>,
): ComputedRef<T>

export function useSum<T, U>(
  list: MaybeComputedRef<MaybeComputedRef<T>[]>,
  adder: UseSumAdder<U, T, U>,
  initialValue: U,
): ComputedRef<U>

export function useSum<T>(
  list: MaybeComputedRef<MaybeComputedRef<T>[]>,
  adder: ((...p: any[]) => any) = (sum, value) => sum + value,
  ...args: any[]
): ComputedRef<T> {
  return computed(() => {
    const reduce = Array.prototype.reduce.bind(resolveUnref(list))

    const reduceCallback = (sum: any, value: any, index: number) => adder(resolveUnref(sum), resolveUnref(value), index)

    return args.length
      ? reduce(reduceCallback, args[0])
      : reduce(reduceCallback)
  })
}
