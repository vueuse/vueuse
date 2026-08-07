import type { WatchCallback, WatchHandle, WatchOptions, WatchSource } from 'vue'
import { nextTick, watch } from 'vue'

type Truthy<T> = T extends false | null | undefined ? never : T

export interface WheneverOptions<Immediate = boolean> extends WatchOptions<Immediate> {
  /**
   * Only trigger once when the condition is met
   *
   * Override the `once` option in `WatchOptions`
   *
   * @default false
   */
  once?: boolean
}

/**
 * Shorthand for watching value to be truthy
 *
 * @see https://vueuse.org/whenever
 */
export function whenever<T>(source: WatchSource<T>, cb: WatchCallback<Truthy<T>, T | undefined>, options?: WheneverOptions<true>): WatchHandle
export function whenever<T>(source: WatchSource<T>, cb: WatchCallback<Truthy<T>, T>, options?: WheneverOptions<false>): WatchHandle
export function whenever<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, cb: WatchCallback<Truthy<T>, T | undefined>, options?: WheneverOptions<Immediate>) {
  const stop = watch(
    source,
    (v, ov, onInvalidate) => {
      if (v) {
        if (options?.once)
          nextTick(() => stop())
        cb(v as Truthy<T>, ov, onInvalidate)
      }
    },
    {
      ...options,
      once: false,
    } as WatchOptions,
  )
  return stop
}
