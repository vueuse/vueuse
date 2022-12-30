import { type ComputedRef, type Ref, ref, watchEffect } from 'vue-demi'

/**
 * Updates prevRef when true is returned
 * default (a?: T, b?: T) => !Object.is(a, b)
 */
export type ShouldUpdateFunc<T> = (prev: T | undefined, next: T) => boolean

const defaultShouldUpdate = <T>(a?: T, b?: T) => !Object.is(a, b)

/**
 * A Hook to return the previous state.
 *
 * @see https://vueuse.org/core/usePrevious
 * @param state
 * @param [shouldUpdate]
 */
export function usePrevious<T>(
  state: Ref<T> | ComputedRef<T>,
  shouldUpdate: ShouldUpdateFunc<T> = defaultShouldUpdate,
) {
  const prevRef = ref<T>()
  const curRef = ref<T>()
  watchEffect(() => {
    if (shouldUpdate(curRef.value, state.value)) {
      prevRef.value = curRef.value
      curRef.value = state.value
    }
  })
  return prevRef
}

