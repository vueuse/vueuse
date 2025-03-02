import type { MaybeRefOrGetter, Ref, WatchOptions } from 'vue'
import { ref as deepRef, isRef, shallowRef, toValue, watch } from 'vue'

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
   * Ref indicates whether the cloned data is modified
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
  const cloned = deepRef({} as T) as Ref<T>
  const isModified = shallowRef<boolean>(false)
  let _lastSync = false

  const {
    manual,
    clone = cloneFnJSON,
    // watch options
    deep = true,
    immediate = true,
  } = options

  watch(cloned, () => {
    if (_lastSync) {
      _lastSync = false
      return
    }
    isModified.value = true
  }, {
    deep: true,
    flush: 'sync',
  })

  function sync() {
    _lastSync = true
    isModified.value = false

    cloned.value = clone(toValue(source))
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
