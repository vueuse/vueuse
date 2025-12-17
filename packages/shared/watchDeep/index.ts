import type { MultiWatchSources, WatchCallback, WatchHandle, WatchOptions, WatchSource } from 'vue'
import type { MapOldSources, MapSources } from '../utils/types'

import { watch } from 'vue'

// overloads
export function watchDeep<
  T extends Readonly<MultiWatchSources>,
  Immediate extends Readonly<boolean> = false,
>(
  source: [...T],
  cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>,
  options?: Omit<WatchOptions<Immediate>, 'deep'>
): WatchHandle

export function watchDeep<T, Immediate extends Readonly<boolean> = false>(
  source: WatchSource<T>,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: Omit<WatchOptions<Immediate>, 'deep'>
): WatchHandle

export function watchDeep<
  T extends object,
  Immediate extends Readonly<boolean> = false,
>(
  source: T,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: Omit<WatchOptions<Immediate>, 'deep'>
): WatchHandle

/**
 * Shorthand for watching value with {deep: true}
 *
 * @see https://vueuse.org/watchDeep
 */
export function watchDeep<T = any, Immediate extends Readonly<boolean> = false>(source: T | WatchSource<T>, cb: any, options?: Omit<WatchOptions<Immediate>, 'deep'>) {
  return watch(
    source as WatchSource<T>,
    cb,
    {
      ...options,
      deep: true,
    },
  )
}
