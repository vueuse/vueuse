import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { Ref, WatchOptions } from 'vue'
import { toValue } from '@vueuse/shared'
import { isRef, ref, watch } from 'vue'

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
   *  Compares the current cloned value to its initial value to check if it’s been modified
   */
  isClonedModified: Ref<boolean>
  /**
   * Compares the current source value to the initial source value to determine if it's been modified
   */
  isOriginalModified: Ref<boolean>
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
  const isOriginalModified = ref<boolean>(false)
  const isClonedModified = ref<boolean>(false)
  const {
    manual,
    clone = cloneFnJSON,
    // watch options
    deep = true,
    immediate = true,
  } = options
  const initialSourceValue = toValue(source)
  const initialClonedValue = clone(initialSourceValue)

  function sync() {
    const currentSource = toValue(source)
    cloned.value = clone(currentSource)

    isOriginalModified.value = JSON.stringify(currentSource) !== JSON.stringify(initialSourceValue)
    isClonedModified.value = JSON.stringify(cloned.value) !== JSON.stringify(initialClonedValue)
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

  return { cloned, isOriginalModified, isClonedModified, sync }
}
