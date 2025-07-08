import type { WatchCallback, WatchOptions, WatchSource, WatchStopHandle } from 'vue'
import type { MapOldSources, MapSources } from '../utils'
import { watch } from 'vue'

// overloads
export function watchOnce<T extends Readonly<WatchSource<unknown>[]>>(
  source: [...T],
  cb: WatchCallback<MapSources<T>, MapOldSources<T, true>>,
  options?: Omit<WatchOptions<true>, 'once'>
): WatchStopHandle

export function watchOnce<T>(
  source: WatchSource<T>,
  cb: WatchCallback<T, T | undefined>,
  options?: Omit<WatchOptions<true>, 'once'>
): WatchStopHandle

export function watchOnce<T extends object>(
  source: T,
  cb: WatchCallback<T, T | undefined>,
  options?: Omit<WatchOptions<true>, 'once'>
): WatchStopHandle

/**
 * Shorthand for watching value with { once: true }
 *
 * @see https://vueuse.org/watchOnce
 */
export function watchOnce<T = any>(source: T, cb: any, options?: Omit<WatchOptions, 'once'>) {
  return watch(
    source as any,
    cb,
    {
      ...options,
      once: true,
    },
  )
}
