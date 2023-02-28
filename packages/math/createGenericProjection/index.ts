import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

export type ProjectorFunction<F, T> = (input: F, from: readonly [F, F], to: readonly [T, T]) => T

export type UseProjection<F, T> = (input: MaybeComputedRef<F>) => ComputedRef<T>

export function createGenericProjection<F = number, T = number>(
  fromDomain: MaybeComputedRef<readonly [F, F]>,
  toDomain: MaybeComputedRef<readonly [T, T]>,
  projector: ProjectorFunction<F, T>,
): UseProjection<F, T> {
  return (input: MaybeComputedRef<F>) => {
    return computed(() => projector(resolveUnref(input), resolveUnref(fromDomain), resolveUnref(toDomain)))
  }
}
