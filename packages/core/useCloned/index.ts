import type { MaybeRef } from '@vueuse/shared'
import type { Ref, WatchOptions, WatchStopHandle } from 'vue-demi'
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

export function useCloned<T extends Record<any, any> = Record<any, any>>(source: Ref<T>, options: UseClonedOptions & { manual: true }): { cloned: Ref<T>; sync: () => void }
export function useCloned<T extends Record<any, any> = Record<any, any>>(source: Ref<T>, options?: UseClonedOptions & { manual: false } | Omit<UseClonedOptions, 'manual'>): { cloned: Ref<T>; sync: () => void; stop: WatchStopHandle }
export function useCloned<T extends Record<any, any> = Record<any, any>>(source: T): { cloned: Ref<T>; sync: () => void; stop: WatchStopHandle }
export function useCloned<T extends Record<any, any> = Record<any, any>>(source: MaybeRef<T>, options: UseClonedOptions = {}) {
  const cloned = ref<T>({} as T)

  const { manual, cloneFunction, watchOptions = { immediate: true, deep: true } } = options

  let stopWatcher: undefined | WatchStopHandle

  if (!manual && isRef(source))
    stopWatcher = watch(source, sync, watchOptions)
  else
    sync()

  function defaultCloning() {
    return JSON.parse(JSON.stringify(unref(source)))
  }

  function sync() {
    cloned.value = cloneFunction ? cloneFunction(unref(source), cloned.value) : defaultCloning()
  }

  return { cloned, sync, ...(stopWatcher && { stop: stopWatcher }) } as any
}
