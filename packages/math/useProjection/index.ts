import type { MaybeComputedRef } from '@vueuse/shared'
import type { ProjectorFunction } from '../createGenericProjection'
import { createProjection } from '../createProjection'

/**
 * Reactive numeric projection from one domain to another.
 *
 * @see https://vueuse.org/useProjection
 */
export function useProjection(
  input: MaybeComputedRef<number>,
  fromDomain: MaybeComputedRef<readonly [number, number]>,
  toDomain: MaybeComputedRef<readonly [number, number]>,
  projector?: ProjectorFunction<number, number>,
) {
  return createProjection(fromDomain, toDomain, projector)(input)
}
