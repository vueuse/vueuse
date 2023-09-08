import type { WatchCallback, WatchOptions, WatchSource, WatchStopHandle } from 'vue-demi'
import { watch } from 'vue-demi'

import type { MapOldSources, MapSources, MultiWatchSources } from '../utils/types'

// overloads
export function watchDeep<
  T extends Readonly<MultiWatchSources>,
  Immediate extends Readonly<boolean> = false,
>(
  source: T,
  cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>,
  options?: Omit<WatchOptions<Immediate>, 'deep'>
): WatchStopHandle

export function watchDeep<T, Immediate extends Readonly<boolean> = false>(
  source: WatchSource<T>,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: Omit<WatchOptions<Immediate>, 'deep'>
): WatchStopHandle

export function watchDeep<
  T extends object,
  Immediate extends Readonly<boolean> = false,
>(
  source: T,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: Omit<WatchOptions<Immediate>, 'deep'>
): WatchStopHandle

/**
 * Shorthand for watching value with {deep: true}
 *
 * @see https://vueuse.org/watchDeep
 */
export function watchDeep<T = any, Immediate extends Readonly<boolean> = false>(source: T | WatchSource<T>, cb: any, options?: Omit<WatchOptions<Immediate>, 'deep'>) {
  return watch(
    source as any,
    cb,
    {
      ...options,
      deep: true,
    },
  )
}
