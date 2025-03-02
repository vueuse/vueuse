import type { MaybeRefOrGetter } from 'vue'
import type { ProjectorFunction } from '../createGenericProjection'
import { createProjection } from '../createProjection'

/**
 * Reactive numeric projection from one domain to another.
 *
 * @see https://vueuse.org/useProjection
 */
export function useProjection(
  input: MaybeRefOrGetter<number>,
  fromDomain: MaybeRefOrGetter<readonly [number, number]>,
  toDomain: MaybeRefOrGetter<readonly [number, number]>,
  projector?: ProjectorFunction<number, number>,
) {
  return createProjection(fromDomain, toDomain, projector)(input)
}
