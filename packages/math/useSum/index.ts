import type { MaybeRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'

export function useSum<T = number>(list: MaybeRef<T>[]): ComputedRef<T> {
  return computed(() => {
    const reduce = Array.prototype.reduce.bind(list)
    return reduce((sum: any, value: any) => resolveUnref(sum) + resolveUnref(value))
  })
}
