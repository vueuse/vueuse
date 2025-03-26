import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

export type ProjectorFunction<F, T> = (input: F, from: readonly [F, F], to: readonly [T, T]) => T

export type UseProjection<F, T> = (input: MaybeRefOrGetter<F>) => ComputedRef<T>

export function createGenericProjection<F = number, T = number>(
  fromDomain: MaybeRefOrGetter<readonly [F, F]>,
  toDomain: MaybeRefOrGetter<readonly [T, T]>,
  projector: ProjectorFunction<F, T>,
): UseProjection<F, T> {
  return (input: MaybeRefOrGetter<F>) => {
    return computed(() => projector(toValue(input), toValue(fromDomain), toValue(toDomain)))
  }
}
