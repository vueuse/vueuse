import type { Ref } from 'vue-demi'
import { computed, unref } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'

export interface ProjectionOptions<T, U> {
  domainToValue: MaybeRef<(domainStart: T, domainEnd: T, valueStart: U, valueEnd: U, domain: T) => U>
}

export interface CoProjectionOptions<T, U> extends ProjectionOptions<T, U> {
  valueToDomain: MaybeRef<(domainStart: T, domainEnd: T, valueStart: U, valueEnd: U, value: U) => T>
}

export type Projector<T, U> = (domain: MaybeRef<T>) => Ref<U>
export type CoProjector<T, U> = (value: MaybeRef<U>) => Ref<T>

function useGenericProjection<T, U>(
  domainStart: MaybeRef<T>,
  domainEnd: MaybeRef<T>,
  valueStart: MaybeRef<U>,
  valueEnd: MaybeRef<U>,
  options: CoProjectionOptions<T, U>
): readonly [Projector<T, U>, CoProjector<T, U>]

function useGenericProjection<T, U>(
  domainStart: MaybeRef<T>,
  domainEnd: MaybeRef<T>,
  valueStart: MaybeRef<U>,
  valueEnd: MaybeRef<U>,
  options: ProjectionOptions<T, U>
): readonly [Projector<T, U>]

function useGenericProjection<T, U>(
  domainStart: MaybeRef<T>,
  domainEnd: MaybeRef<T>,
  valueStart: MaybeRef<U>,
  valueEnd: MaybeRef<U>,
  options: ProjectionOptions<T, U> | CoProjectionOptions<T, U>
): readonly [Projector<T, U>] | readonly [Projector<T, U>, CoProjector<T, U>]

function useGenericProjection<T, U>(
  domainStart: MaybeRef<T>,
  domainEnd: MaybeRef<T>,
  valueStart: MaybeRef<U>,
  valueEnd: MaybeRef<U>,
  options: ProjectionOptions<T, U> | CoProjectionOptions<T, U>,
): readonly [Projector<T, U>] | readonly [Projector<T, U>, CoProjector<T, U>] {
  const { domainToValue } = options

  const projector = (domain: MaybeRef<T>) => {
    return computed(() => {
      return unref(domainToValue)(unref(domainStart), unref(domainEnd), unref(valueStart), unref(valueEnd), unref(domain))
    })
  }

  const valueToDomain = 'valueToDomain' in options ? options.valueToDomain : undefined
  if (!valueToDomain)
    return [projector] as const

  const coProjector = (value: MaybeRef<U>) => computed(() => {
    return unref(valueToDomain)(unref(domainStart), unref(domainEnd), unref(valueStart), unref(valueEnd), unref(value))
  })

  return [
    projector,
    coProjector,
  ] as const
}

const defaultNumericCoProjector: CoProjectionOptions<number, number> = {
  domainToValue: (domainStart, domainEnd, valueStart, valueEnd, domain) => {
    return (domain - domainStart) / (domainEnd - domainStart) * (valueEnd - valueStart) + valueStart
  },
  valueToDomain: (domainStart, domainEnd, valueStart, valueEnd, value) => {
    return (value - valueStart) / (valueEnd - valueStart) * (domainEnd - domainStart) + domainStart
  },
}

export function useProjection(
  domainStart: MaybeRef<number>,
  domainEnd: MaybeRef<number>,
  valueStart: MaybeRef<number>,
  valueEnd: MaybeRef<number>,
): readonly [Projector<number, number>, CoProjector<number, number>] {
  return useGenericProjection(domainStart, domainEnd, valueStart, valueEnd, defaultNumericCoProjector)
}
