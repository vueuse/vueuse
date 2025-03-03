import type { MaybeRefOrGetter } from 'vue'
import type { ProjectorFunction, UseProjection } from '../createGenericProjection'
import { createGenericProjection } from '../createGenericProjection'

function defaultNumericProjector(input: number, from: readonly [number, number], to: readonly [number, number]) {
  return (input - from[0]) / (from[1] - from[0]) * (to[1] - to[0]) + to[0]
}

export function createProjection(
  fromDomain: MaybeRefOrGetter<readonly [number, number]>,
  toDomain: MaybeRefOrGetter<readonly [number, number]>,
  projector: ProjectorFunction<number, number> = defaultNumericProjector,
): UseProjection<number, number> {
  return createGenericProjection(fromDomain, toDomain, projector)
}
