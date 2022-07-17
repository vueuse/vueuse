import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

export type MaybeComputedRefArgs<T> = MaybeComputedRef<T>[] | [MaybeComputedRef<MaybeComputedRef<T>[]>]

export function resolveUnrefArgsFlat<T>(args: MaybeComputedRefArgs<T>): T[] {
  return args
    .flatMap((i: any) => {
      const v = resolveUnref(i)
      if (Array.isArray(v))
        return v.map(i => resolveUnref(i))
      return [v]
    })
}
