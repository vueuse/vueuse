import { computed, Ref, ref, watch, WatchSource } from 'vue-demi'

/**
 * Explicitly define the deps of computed
 *
 * @param effects
 * @param fn
 */
export function controlledComputed<T, S>(source: WatchSource<S>, fn: () => T) {
  const v = ref(fn()) as Ref<T>
  watch(
    source,
    () => v.value = fn(),
  )
  return computed<T>(() => v.value)
}
