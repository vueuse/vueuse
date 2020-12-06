import { computed, Ref, ref, watch, WatchSource } from 'vue-demi'

/**
 * Explicitly define the deps of computed.
 *
 * @param source
 * @param fn
 */
export function controlledComputed<T, S>(source: WatchSource<S>, fn: () => T) {
  const v = ref(fn()) as Ref<T>
  watch(
    source,
    () => v.value = fn(),
    {
      flush: 'sync',
    },
  )
  return computed<T>(() => v.value)
}
