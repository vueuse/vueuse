import type { WatchCallback, WatchHandle, WatchOptions, WatchSource } from 'vue'
import type { MapOldSources, MapSources } from '../utils'
import { nextTick, watch } from 'vue'

export interface WheneverOptions extends WatchOptions {
  /**
   * Only trigger once when the condition is met
   *
   * Override the `once` option in `WatchOptions`
   *
   * @default false
   */
  once?: boolean
}

// overloads
export function whenever<T extends Readonly<WatchSource<unknown>[]>>(sources: readonly [...T] | T, cb: WatchCallback<MapSources<T>, MapOldSources<T, true>>, options?: WheneverOptions): WatchHandle
export function whenever<T>(source: WatchSource<T | false | null | undefined>, cb: WatchCallback<T>, options?: WheneverOptions): WatchHandle
export function whenever<T extends object>(source: T, cb: WatchCallback<T>, options?: WheneverOptions): WatchHandle

/**
 * Shorthand for watching value to be truthy
 *
 * @see https://vueuse.org/whenever
 */
export function whenever(source: any, cb: WatchCallback, options?: WheneverOptions) {
  const stop = watch(
    source,
    (v, ov, onInvalidate) => {
      if (Array.isArray(v) ? v.some(Boolean) : v) {
        if (options?.once)
          nextTick(() => stop())
        cb(v, ov, onInvalidate)
      }
    },
    {
      ...options,
      once: false,
    } as WatchOptions,
  )
  return stop
}
