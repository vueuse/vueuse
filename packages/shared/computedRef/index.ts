import { ref, toValue, watch } from 'vue-demi'
import type { Ref, WatchSource } from 'vue-demi'

export interface RefWithControl<T> extends Ref<T> {
  /**
   * Force update the ref value.
   */
  trigger(): void
}

/**
 * Ref that syncs to the watch source.
 *
 * It's similar to the built-in `computed`, but returns a fully reactive ref.
 */
export function computedRef<T>(source: WatchSource<T>) {
  const result = ref() as RefWithControl<T>

  watch(source, (value) => {
    result.value = value
  }, {
    immediate: true,
    flush: 'sync',
  })

  if (Object.isExtensible(result)) {
    result.trigger = () => {
      result.value = toValue(source)
    }
  }

  return result
}
