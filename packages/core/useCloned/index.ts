import type { MaybeRef } from '@vueuse/shared'
import type { WatchOptions } from 'vue-demi'
import { isRef, ref, unref, watch } from 'vue-demi'

export interface UseClonedOptions<T extends Record<any, any> = Record<any, any>> {
  /**
   * sync source only by function
   */
  manual?: boolean
  /**
   * Custom clone function should return new value for cloned data
   */
  cloneFunction?: (source: T, cloned: T) => T
  /**
   * Options for watcher
   *
   * @default { immediate: true, deep: true }
   */
  watchOptions?: WatchOptions
}

export function useCloned<T extends Record<any, any> = Record<any, any>>(source: MaybeRef<T>, options: UseClonedOptions = {}) {
  const cloned = ref<T>({} as T)

  const { manual, cloneFunction, watchOptions = { immediate: true, deep: true } } = options

  if (!manual && isRef(source))
    watch(source, sync, watchOptions)
  else
    sync()

  function defaultCloning() {
    const structuredClone = window?.structuredClone as any

    return structuredClone ? structuredClone(unref(source)) : JSON.parse(JSON.stringify(unref(source)))
  }

  function sync() {
    cloned.value = cloneFunction ? cloneFunction(unref(source), cloned.value) : defaultCloning()
  }

  return { cloned, sync }
}
