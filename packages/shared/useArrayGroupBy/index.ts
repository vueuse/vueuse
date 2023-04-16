import { computed } from 'vue-demi'
import type { ComputedRef } from 'vue-demi'

import type { MaybeRefOrGetter } from '../utils'
import { toValue } from '../toValue'

type KeyTypes = string | symbol | number

export function useArrayGroupBy<T, K extends KeyTypes>(
  list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  fn: (element: T) => K,
): ComputedRef<Record<K, T[]>>

export function useArrayGroupBy<T, K extends KeyTypes>(
  list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  fn: (element: MaybeRefOrGetter<T>) => K,
): ComputedRef<Record<K, T[]>> {
  return computed(() => {
    const result: Record<K, T[]> = {} as { [key in K]: T[] }
    toValue(list).forEach((item) => {
      const _item = toValue(item)
      const key = fn(_item)
      if (!result[key])
        result[key] = []

      result[key].push(_item)
    })
    return result
  })
}
