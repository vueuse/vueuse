import { WatchOptions, watch, WatchSource, WatchCallback } from 'vue-demi'

/**
 * Shorthand for watching value to be truthy
 *
 * @see https://vueuse.js.org/whenever
 */
export function whenever<T>(source: WatchSource<T>, cb: WatchCallback, options?: WatchOptions) {
  return watch(
    source,
    (v, ov, onInvalidate) => { if (v) cb(v, ov, onInvalidate) },
    options,
  )
}
