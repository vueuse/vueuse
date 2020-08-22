import { ref, watch, computed, WatchSource, Ref, isRef, getCurrentInstance, onMounted, onUnmounted, nextTick } from 'vue-demi'

export type MaybeRef<T> = T | Ref<T>

export function getValue<T>(v: MaybeRef<T>) {
  return isRef(v) ? v.value : v
}

/**
 * Explicitly define the deps of computed
 *
 * @param effects
 * @param fn
 */
export function explicitComputed<T, S>(source: WatchSource<S>, fn: () => T) {
  const v = ref(fn())
  watch(
    source,
    () => v.value = fn() as any,
  )
  return computed(() => v.value)
}

/**
 * Call onMounted() if it's inside a component lifecycle, if not, run just call the function
 *
 * @param fn
 * @param sync if set to false, it will run in the nextTick() of Vue
 */
export function maybeOnMounted(fn: () => void, sync = true) {
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
export function maybeOnUnmounted(fn: Function) {
  if (getCurrentInstance())
    onUnmounted(fn)
}
