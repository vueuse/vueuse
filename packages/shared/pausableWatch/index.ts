import { WatchSource, WatchStopHandle, WatchCallback } from 'vue-demi'
import { Fn, MapOldSources, MapSources, pauseableFilter } from '../utils'
import { watchWithFilter, WatchWithFilterOptions } from '../watchWithFilter'

export interface PausableWatchReturn {
  stop: WatchStopHandle
  pause: Fn
  resume: Fn
}

// overlads
export function pausableWatch<T extends Readonly<WatchSource<unknown>[]>, Immediate extends Readonly<boolean> = false>(sources: T, cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>, options?: WatchWithFilterOptions<Immediate>): PausableWatchReturn
export function pausableWatch<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchWithFilterOptions<Immediate>): PausableWatchReturn
export function pausableWatch<T extends object, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchWithFilterOptions<Immediate>): PausableWatchReturn

// implementation
export function pausableWatch<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: WatchWithFilterOptions<Immediate> = {},
): PausableWatchReturn {
  const {
    eventFilter: filter,
    ...watchOptions
  } = options

  const { eventFilter, pause, resume } = pauseableFilter(filter)
  const stop = watchWithFilter(
    source,
    cb,
    {
      ...watchOptions,
      eventFilter,
    },
  )

  return { stop, pause, resume }
}
