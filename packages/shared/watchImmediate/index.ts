import type { MultiWatchSources, WatchCallback, WatchHandle, WatchOptions, WatchSource } from 'vue'
import type { MapOldSources, MapSources } from '../utils/types'

import { watch } from 'vue'

// overloads
export function watchImmediate<T extends Readonly<MultiWatchSources>>(
  source: [...T],
  cb: WatchCallback<MapSources<T>, MapOldSources<T, true>>,
  options?: Omit<WatchOptions<true>, 'immediate'>
): WatchHandle

export function watchImmediate<T>(
  source: WatchSource<T>,
  cb: WatchCallback<T, T | undefined>,
  options?: Omit<WatchOptions<true>, 'immediate'>
): WatchHandle

export function watchImmediate<T extends object>(
  source: T,
  cb: WatchCallback<T, T | undefined>,
  options?: Omit<WatchOptions<true>, 'immediate'>
): WatchHandle

/**
 * Shorthand for watching value with {immediate: true}
 *
 * @see https://vueuse.org/watchImmediate
 */
export function watchImmediate<T = any>(source: T, cb: any, options?: Omit<WatchOptions, 'immediate'>) {
  return watch(
    source as WatchSource<T>,
    cb,
    {
      ...options,
      immediate: true,
    },
  )
}
