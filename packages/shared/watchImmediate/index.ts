import type { WatchCallback, WatchOptions, WatchSource } from 'vue-demi'
import { watch } from 'vue-demi'

/**
 * Shorthand for watching value with {immediate: true}
 *
 * @see https://vueuse.org/watchImmediate
 */
export function watchImmediate<T>(source: WatchSource<T | false | null | undefined>, cb: WatchCallback<T>, options?: WatchOptions) {
  return watch(
    source,
    (v, ov, onInvalidate) => {
      if (v)
        cb(v, ov, onInvalidate)
    },
    {
      ...options,
      immediate: true,
    },
  )
}
