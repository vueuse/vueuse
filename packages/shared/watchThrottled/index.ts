import type { WatchCallback, WatchOptions, WatchSource, WatchStopHandle } from 'vue-demi'
import type { MapOldSources, MapSources, MaybeComputedRef } from '../utils'
import { throttleFilter } from '../utils'
import { watchWithFilter } from '../watchWithFilter'

export interface WatchThrottledOptions<Immediate> extends WatchOptions<Immediate> {
  throttle?: MaybeComputedRef<number>
  trailing?: boolean
  leading?: boolean
}

// overloads
export function watchThrottled<T extends Readonly<WatchSource<unknown>[]>, Immediate extends Readonly<boolean> = false>(sources: [...T], cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>, options?: WatchThrottledOptions<Immediate>): WatchStopHandle
export function watchThrottled<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchThrottledOptions<Immediate>): WatchStopHandle
export function watchThrottled<T extends object, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchThrottledOptions<Immediate>): WatchStopHandle

// implementation
export function watchThrottled<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: WatchThrottledOptions<Immediate> = {},
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

// alias
export { watchThrottled as throttledWatch }
