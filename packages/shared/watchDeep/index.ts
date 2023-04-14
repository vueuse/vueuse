import type { WatchCallback, WatchOptions, WatchSource } from 'vue-demi'
import { watch } from 'vue-demi'

/**
 * Shorthand for watching value with {deep: true}
 *
 * @see https://vueuse.org/watchDeep
 */
export function watchDeep<T>(source: WatchSource<T>, cb: WatchCallback<T>, options?: Omit<WatchOptions, 'deep'>) {
  return watch(
    source,
    cb,
    {
      ...options,
      deep: true,
    },
  )
}
