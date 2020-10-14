import { watch, computed, WatchSource, Ref, getCurrentInstance, onMounted, onUnmounted, nextTick, reactive } from 'vue-demi'

export * from '../../_utils'

export type MaybeRef<T> = T | Ref<T>

/**
 * Explicitly define the deps of computed
 *
 * @param effects
 * @param fn
 */
export function explicitComputed<T, S>(source: WatchSource<S>, fn: () => T) {
  const v = reactive<any>({ value: fn() })
  watch(
    source,
    () => v.value = fn(),
  )
  return computed<T>(() => v.value)
}

/**
 * Call onMounted() if it's inside a component lifecycle, if not, run just call the function
 *
 * @param fn
 * @param sync if set to false, it will run in the nextTick() of Vue
 */
export function tryOnMounted(fn: () => void, sync = true) {
  if (getCurrentInstance())
    onMounted(fn)
  else if (sync)
    fn()
  else
    nextTick(fn)
}

/**
 * Call onUnmounted() if it's inside a component lifecycle, if not, do nothing
 *
 * @param fn
 */
export function tryOnUnmounted(fn: () => void) {
  if (getCurrentInstance())
    onUnmounted(fn)
}

export function promiseTimeout(ms: number, throwOnTimeout = false, reason = 'Timeout'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (throwOnTimeout)
      setTimeout(() => reject(reason), ms)
    else
      setTimeout(resolve, ms)
  })
}

export function invoke<T>(fn: () => T): T {
  return fn()
}
