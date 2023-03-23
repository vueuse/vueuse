import type { Ref } from 'vue-demi'
import { computed, shallowRef, watch } from 'vue-demi'
import { resolveRef, resolveUnref } from '@vueuse/shared'
import type { MaybeComputedRef, MaybeRef } from '@vueuse/shared'

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
export function useCycleList<T>(list: MaybeComputedRef<T[]>, options?: UseCycleListOptions<T>): UseCycleListReturn<T> {
  const state = shallowRef(getInitialValue()) as Ref<T>
  const listRef = resolveRef(list)

  const index = computed<number>({
    get() {
      const targetList = resolveUnref<T[]>(list)

      let index = options?.getIndexOf
        ? options.getIndexOf(state.value, targetList)
        : targetList.indexOf(state.value)

      if (index < 0)
        index = options?.fallbackIndex ?? 0

      return index
    },
    set(v) {
      set(v)
    },
  })

  function set(i: number) {
    const targetList = listRef.value
    const length = targetList.length
    const index = (i % length + length) % length
    const value = targetList[index]
    state.value = value
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

  function getInitialValue() {
    return resolveUnref(options?.initialValue ?? resolveUnref<T[]>(list)[0]) ?? undefined
  }

  watch(listRef, () => set(index.value))

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
