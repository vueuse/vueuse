import type { WatchCallback, WatchOptions, WatchSource } from 'vue-demi'
import { watch } from 'vue-demi'

/**
 * Shorthand for watching value with {immediate: true}
 *
 * @see https://vueuse.org/watchImmediate
 */
export function watchImmediate<T>(source: WatchSource<T>, cb: WatchCallback<T>, options?: Omit<WatchOptions, 'immediate'>) {
  return watch(
    source,
    cb,
    {
      ...options,
      immediate: true,
    },
  )
}
