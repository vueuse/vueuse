import type { MaybeRefOrGetter } from '@vueuse/shared'
import { isArray, toValue } from '@vueuse/shared'

export type MaybeComputedRefArgs<T> = MaybeRefOrGetter<T>[] | [MaybeRefOrGetter<MaybeRefOrGetter<T>[]>]

export function toValueArgsFlat<T>(args: MaybeComputedRefArgs<T>): T[] {
  return args
    .flatMap((i: any) => {
      const v = toValue(i)
      if (isArray(v))
        return v.map(i => toValue(i))
      return [v]
    })
}
