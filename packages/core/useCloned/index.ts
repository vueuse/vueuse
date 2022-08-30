import type { MaybeComputedRef } from '@vueuse/shared'
import type { WatchOptions } from 'vue-demi'
import { isRef, ref, unref, watch } from 'vue-demi'

export interface UseClonedOptions<T = any> {
  /**
   * sync source only by function
   */
  manual?: boolean
  /**
   * Custom clone function should return new value for cloned data
   */
  cloneFunction?: (source: T, cloned: T) => T
}

export function useCloned<T>(source: MaybeComputedRef<T>, options: UseClonedOptions = {}, watchOptions: WatchOptions = { deep: true, immediate: true }) {
  const cloned = ref<T>({} as T)

  const { manual, cloneFunction } = options

  if (!manual && isRef(source))
    watch(source, sync, watchOptions)
  else
    sync()

  function defaultCloning() {
    return JSON.parse(JSON.stringify(unref(source)))
  }

  function sync() {
    cloned.value = cloneFunction ? cloneFunction(unref(source), cloned.value) : defaultCloning()
  }

  return { cloned, sync }
}
