import type { MaybeRefOrGetter, MultiWatchSources, WatchCallback, WatchHandle, WatchOptions, WatchSource } from 'vue'
import type { MapOldSources, MapSources } from '../utils'
import { throttleFilter } from '../utils'
import { watchWithFilter } from '../watchWithFilter'

export interface WatchThrottledOptions<Immediate> extends WatchOptions<Immediate> {
  throttle?: MaybeRefOrGetter<number>
  trailing?: boolean
  leading?: boolean
}

// overloads
export function watchThrottled<T extends Readonly<MultiWatchSources>, Immediate extends Readonly<boolean> = false>(sources: [...T], cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>, options?: WatchThrottledOptions<Immediate>): WatchHandle
export function watchThrottled<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchThrottledOptions<Immediate>): WatchHandle
export function watchThrottled<T extends object, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchThrottledOptions<Immediate>): WatchHandle

// implementation
export function watchThrottled<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: WatchThrottledOptions<Immediate> = {},
): WatchHandle {
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

/** @deprecated use `watchThrottled` instead */
export const throttledWatch = watchThrottled
