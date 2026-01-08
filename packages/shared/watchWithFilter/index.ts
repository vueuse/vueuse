import type { MultiWatchSources, WatchCallback, WatchHandle, WatchOptions, WatchSource } from 'vue'
import type { ConfigurableEventFilter, MapOldSources, MapSources } from '../utils'
import { watch } from 'vue'
import { bypassFilter, createFilterWrapper } from '../utils'

export interface WatchWithFilterOptions<Immediate> extends WatchOptions<Immediate>, ConfigurableEventFilter {}

// overloads
export function watchWithFilter<T extends Readonly<MultiWatchSources>, Immediate extends Readonly<boolean> = false>(sources: [...T], cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>, options?: WatchWithFilterOptions<Immediate>): WatchHandle
export function watchWithFilter<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchWithFilterOptions<Immediate>): WatchHandle
export function watchWithFilter<T extends object, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchWithFilterOptions<Immediate>): WatchHandle

// implementation
export function watchWithFilter<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: WatchWithFilterOptions<Immediate> = {},
): WatchHandle {
  const {
    eventFilter = bypassFilter,
    ...watchOptions
  } = options

  return watch(
    source,
    createFilterWrapper(
      eventFilter,
      cb,
    ),
    watchOptions,
  )
}
