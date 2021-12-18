import type { WatchCallback, WatchOptions, WatchSource, WatchStopHandle } from 'vue-demi'
import type { MapOldSources, MapSources, MaybeRef } from '../utils'
import { throttleFilter } from '../utils'
import { watchWithFilter } from '../watchWithFilter'

export interface ThrottledWatchOptions<Immediate> extends WatchOptions<Immediate> {
  throttle?: MaybeRef<number>
  trailing?: boolean
  leading?: boolean
}

// overloads
export function throttledWatch<T extends Readonly<WatchSource<unknown>[]>, Immediate extends Readonly<boolean> = false>(sources: T, cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>, options?: ThrottledWatchOptions<Immediate>): WatchStopHandle
export function throttledWatch<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: ThrottledWatchOptions<Immediate>): WatchStopHandle
export function throttledWatch<T extends object, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: ThrottledWatchOptions<Immediate>): WatchStopHandle

// implementation
export function throttledWatch<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: ThrottledWatchOptions<Immediate> = {},
): WatchStopHandle {
  const {
    throttle = 0,
    trailing = true,
    leading = true,
    ...watchOptions
  } = options

  return watchWithFilter(
    source,
    cb,
    {
      ...watchOptions,
      eventFilter: throttleFilter(throttle, trailing, leading),
    },
  )
}
