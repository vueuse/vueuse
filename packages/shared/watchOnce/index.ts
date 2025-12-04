import type { MultiWatchSources, WatchCallback, WatchHandle, WatchOptions, WatchSource } from 'vue'
import type { MapOldSources, MapSources } from '../utils'
import { watch } from 'vue'

// overloads
export function watchOnce<T extends Readonly<MultiWatchSources>>(
  source: [...T],
  cb: WatchCallback<MapSources<T>, MapOldSources<T, true>>,
  options?: Omit<WatchOptions<true>, 'once'>
): WatchHandle

export function watchOnce<T>(
  source: WatchSource<T>,
  cb: WatchCallback<T, T | undefined>,
  options?: Omit<WatchOptions<true>, 'once'>
): WatchHandle

export function watchOnce<T extends object>(
  source: T,
  cb: WatchCallback<T, T | undefined>,
  options?: Omit<WatchOptions<true>, 'once'>
): WatchHandle

/**
 * Shorthand for watching value with { once: true }
 *
 * @see https://vueuse.org/watchOnce
 */
export function watchOnce<T = any>(source: T, cb: any, options?: Omit<WatchOptions, 'once'>) {
  return watch(
    source as WatchSource<T>,
    cb,
    {
      ...options,
      once: true,
    },
  )
}
