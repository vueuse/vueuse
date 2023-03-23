import type { WatchCallback, WatchOptions, WatchSource } from 'vue-demi'
import { watch } from 'vue-demi'

/**
 * Shorthand for watching value with {deep: true}
 *
 * @see https://vueuse.org/watchDeep
 */
export function watchDeep<T>(source: WatchSource<T | false | null | undefined>, cb: WatchCallback<T>, options?: WatchOptions) {
  return watch(
    source,
    (v, ov, onInvalidate) => {
      if (v)
        cb(v, ov, onInvalidate)
    },
    {
      ...options,
      deep: true,
    },
  )
}
