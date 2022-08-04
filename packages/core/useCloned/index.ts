import type { MaybeRef } from '@vueuse/shared'
import type { Ref, WatchStopHandle } from 'vue-demi'
import { isRef, ref, unref, watch } from 'vue-demi'

export interface UseClonedOptions<T extends Record<any, any> = Record<any, any>> {
  /**
   * sync source only by function
   */
  manual?: boolean
  /**
   * Custom clone function should return new value for cloned data
   */
  cloneFunction?: (source: Partial<T>, cloned: Partial<T>) => Partial<T> | T
}

export function useCloned<T extends Record<any, any> = Record<any, any>>(source: Ref<Partial<T>>, options: UseClonedOptions & { manual: true }): { cloned: Ref<T>; sync: () => void }
export function useCloned<T extends Record<any, any> = Record<any, any>>(source: Ref<Partial<T>>, options?: UseClonedOptions & { manual: false } | Omit<UseClonedOptions, 'manual'>): { cloned: Ref<T>; sync: () => void; stop: WatchStopHandle }
export function useCloned<T extends Record<any, any> = Record<any, any>>(source: Partial<T>): { cloned: Ref<T>; sync: () => void; stop: WatchStopHandle }
export function useCloned<T extends Record<any, any> = Record<any, any>>(source: MaybeRef<Partial<T>>, options: UseClonedOptions = {}) {
  const cloned = ref<T>({} as T)

  const { manual, cloneFunction } = options

  let stopWatcher: undefined | WatchStopHandle

  if (!manual && isRef(source))
    stopWatcher = watch(source, sync, { immediate: true, deep: true })
  else
    sync()

  function sync() {
    if (cloneFunction) {
      cloned.value = cloneFunction(unref(source), cloned.value)

      return
    }

    for (const key in unref(source))
      cloned.value[key] = unref(source)[key as keyof T]
  }

  return { cloned, sync, ...(stopWatcher && { stop: stopWatcher }) } as any
}
