import type { MaybeComputedRef } from '@vueuse/shared'
import type { ComputedRef, WatchOptions } from 'vue-demi'
import { isRef, ref, unref, watch } from 'vue-demi'

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
  cloned: ComputedRef<T>
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
  source: MaybeComputedRef<T>,
  options: UseClonedOptions = {},
) {
  const cloned = ref<T>({} as T)
  const {
    manual,
    clone = cloneFnJSON,
    // watch options
    deep = true,
    immediate = true,
  } = options

  function sync() {
    cloned.value = clone(unref(source))
  }

  if (!manual && isRef(source)) {
    watch(source, sync, {
      ...options,
      deep,
      immediate,
    })
  }
  else {
    sync()
  }

  return { cloned, sync }
}
