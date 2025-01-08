import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { Ref, WatchOptions } from 'vue'
import { isRef, ref, toValue, watch } from 'vue'

export interface UseClonedOptions<T = any> extends WatchOptions {
  /**
   * Custom clone function.
   *
   * By default, it use `JSON.parse(JSON.stringify(value))` to clone.
   */
  clone?: (source: T) => T

  /**
   * Manually sync the ref
   *
   * @default false
   */
  manual?: boolean
}

export interface UseClonedReturn<T> {
  /**
   * Cloned ref
   */
  cloned: Ref<T>
  /**
   * IsModified ref
   */
  isModified: Ref<boolean>
  /**
   * Sync cloned data with source manually
   */
  sync: () => void
}

export type CloneFn<F, T = F> = (x: F) => T

export function cloneFnJSON<T>(source: T): T {
  return JSON.parse(JSON.stringify(source))
}

export function useCloned<T>(
  source: MaybeRefOrGetter<T>,
  options: UseClonedOptions = {},
): UseClonedReturn<T> {
  const cloned = ref({} as T) as Ref<T>
  const isModified = ref<boolean>(false)
  const _isSync = ref<boolean>(false)
  const {
    manual,
    clone = cloneFnJSON,
    // watch options
    deep = true,
    immediate = true,
  } = options

  const { resume, pause } = watch(cloned, () => {
    if (_isSync.value)
      return _isSync.value = false
    isModified.value = true
    pause()
  }, {
    deep: true,
    flush: 'sync',
  })

  function sync() {
    _isSync.value = true
    isModified.value = false

    cloned.value = clone(toValue(source))
    resume()
  }

  if (!manual && (isRef(source) || typeof source === 'function')) {
    watch(source, sync, {
      ...options,
      deep,
      immediate,
    })
  }
  else {
    sync()
  }

  return { cloned, isModified, sync }
}
