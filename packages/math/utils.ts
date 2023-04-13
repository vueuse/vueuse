import type { MaybeComputedRef } from '@vueuse/shared'
import { toValue } from '@vueuse/shared'

export type MaybeComputedRefArgs<T> = MaybeComputedRef<T>[] | [MaybeComputedRef<MaybeComputedRef<T>[]>]

export function toValueArgsFlat<T>(args: MaybeComputedRefArgs<T>): T[] {
  return args
    .flatMap((i: any) => {
      const v = toValue(i)
      if (Array.isArray(v))
        return v.map(i => toValue(i))
      return [v]
    })
}
