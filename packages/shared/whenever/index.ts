import type { WatchCallback, WatchOptions, WatchSource } from 'vue-demi'
import { watch } from 'vue-demi'

type Truthy<T, U = NonNullable<T>> = U extends boolean ? true : U
type WheneverCallback<T> = WatchCallback<Truthy<T>, T | undefined>

/**
 * Shorthand for watching value to be truthy
 *
 * @see https://vueuse.js.org/whenever
 */
export function whenever<T>(source: WatchSource<T>, wcb: WheneverCallback<T>, options?: WatchOptions) {
  return watch(
    source,
    (v, ov, onInvalidate) => { if (v) wcb(v as Truthy<T>, ov, onInvalidate) },
    options,
  )
}
