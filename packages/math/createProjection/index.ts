import type { MaybeComputedRef } from '@vueuse/shared'
import { createGenericProjection } from '../createGenericProjection'
import type { ProjectorFunction, UseProjection } from '../createGenericProjection'

const defaultNumericProjector = (input: number, from: readonly [number, number], to: readonly [number, number]) => {
  return (input - from[0]) / (from[1] - from[0]) * (to[1] - to[0]) + to[0]
}

export function createProjection(
  fromDomain: MaybeComputedRef<readonly [number, number]>,
  toDomain: MaybeComputedRef<readonly [number, number]>,
  projector: ProjectorFunction<number, number> = defaultNumericProjector,
): UseProjection<number, number> {
  return createGenericProjection(fromDomain, toDomain, projector)
}
