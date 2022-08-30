import { type Ref, computed, ref, shallowRef } from 'vue-demi'
import { type MaybeRef } from '@vueuse/shared'

export interface UseCycleListOptions<T> {
  /**
   * The initial value of the state.
   * A ref can be provided to reuse.
   */
  initialValue?: MaybeRef<T>

  /**
   * The default index when
   */
  fallbackIndex?: number

  /**
   * Custom function to get the index of the current value.
   */
  getIndexOf?: (value: T, list: T[]) => number
}

/**
 * Cycle through a list of items
 *
 * @see https://vueuse.org/useCycleList
 */
export function useCycleList<T>(list: T[], options?: UseCycleListOptions<T>): UseCycleListReturn<T> {
  const state = shallowRef(options?.initialValue ?? list[0]) as Ref<T>

  const stateIndex = ref(0)

  const index = computed<number>({
    get() {
      let index = options?.getIndexOf
        ? options.getIndexOf(state.value, list)
        : stateIndex.value

      if (index < 0)
        index = options?.fallbackIndex ?? 0

      return index
    },
    set(v) {
      set(v)
    },
  })

  function set(i: number) {
    const length = list.length
    const index = (i % length + length) % length
    const value = list[index]
    state.value = value
    stateIndex.value = index
    return value
  }

  function shift(delta = 1) {
    return set(index.value + delta)
  }

  function next(n = 1) {
    return shift(n)
  }

  function prev(n = 1) {
    return shift(-n)
  }

  return {
    state,
    index,
    next,
    prev,
  }
}

export interface UseCycleListReturn<T> {
  state: Ref<T>
  index: Ref<number>
  next: (n?: number) => T
  prev: (n?: number) => T
}
