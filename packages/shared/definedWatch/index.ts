import { WatchSource, WatchOptions, WatchStopHandle, WatchCallback } from 'vue-demi'
import { definedFilter, MapOldSources, MapSources } from '../utils'
import { watchWithFilter } from '../watchWithFilter'

export interface DefinedWatchOptions<Immediate> extends WatchOptions<Immediate> {}

// overloads
export function definedWatch<T extends Readonly<WatchSource<unknown>[]>, Immediate extends Readonly<boolean> = false>(sources: T, cb: WatchCallback<MapSources<Exclude<T, null | undefined>>, MapOldSources<T, Immediate>>, options?: DefinedWatchOptions<Immediate>): WatchStopHandle
export function definedWatch<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, cb: WatchCallback<Exclude<T, null | undefined>, Immediate extends true ? T | undefined : T>, options?: DefinedWatchOptions<Immediate>): WatchStopHandle
export function definedWatch<T extends object, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<Exclude<T, null | undefined>, Immediate extends true ? T | undefined : T>, options?: DefinedWatchOptions<Immediate>): WatchStopHandle

// implementation
export function definedWatch<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: DefinedWatchOptions<Immediate> = {},
): WatchStopHandle {
  const {
    ...watchOptions
  } = options

  return watchWithFilter(
    source,
    cb,
    {
      ...watchOptions,
      eventFilter: definedFilter(),
    },
  )
}
