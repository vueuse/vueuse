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
   * IsCloneModified ref
   */
  isCloneModified: Ref<boolean>
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
  const isCloneModified = ref<boolean>(false)
  const {
    manual,
    clone = cloneFnJSON,
    // watch options
    deep = true,
    immediate = true,
  } = options

  function sync() {
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

  const { stop } = watch(cloned, () => {
    isCloneModified.value = true
    stop()
  }, {
    deep: true,
    flush: 'sync',
  })

  return { cloned, isCloneModified, sync }
}
