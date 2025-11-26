import type { MaybeRefOrGetter, MultiWatchSources, WatchCallback, WatchHandle, WatchOptions, WatchSource } from 'vue'
import type { DebounceFilterOptions, MapOldSources, MapSources } from '../utils'
import { debounceFilter } from '../utils'
import { watchWithFilter } from '../watchWithFilter'

export interface WatchDebouncedOptions<Immediate> extends WatchOptions<Immediate>, DebounceFilterOptions {
  debounce?: MaybeRefOrGetter<number>
}

// overloads
export function watchDebounced<T extends Readonly<MultiWatchSources>, Immediate extends Readonly<boolean> = false>(sources: [...T], cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>, options?: WatchDebouncedOptions<Immediate>): WatchHandle
export function watchDebounced<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchDebouncedOptions<Immediate>): WatchHandle
export function watchDebounced<T extends object, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchDebouncedOptions<Immediate>): WatchHandle

// implementation
export function watchDebounced<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: WatchDebouncedOptions<Immediate> = {},
): WatchHandle {
  const {
    debounce = 0,
    maxWait = undefined,
    ...watchOptions
  } = options

  return watchWithFilter(
    source,
    cb,
    {
      ...watchOptions,
      eventFilter: debounceFilter(debounce, { maxWait }),
    },
  )
}

/** @deprecated use `watchDebounced` instead */
export const debouncedWatch = watchDebounced
