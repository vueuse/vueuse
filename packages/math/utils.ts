import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

export type MaybeComputedRefArgs<T> = MaybeRefOrGetter<T>[] | [MaybeRefOrGetter<MaybeRefOrGetter<T>[]>]

export function toValueArgsFlat<T>(args: MaybeComputedRefArgs<T>): T[] {
  return args
    .flatMap((i: any) => {
      const v = toValue(i)
      if (Array.isArray(v))
        return v.map(i => toValue(i))
      return [v]
    })
}
