import type { WatchCallback, WatchOptions, WatchSource, WatchStopHandle } from 'vue'
import type { MapOldSources, MapSources } from '../utils'
import { nextTick, watch } from 'vue'

// overloads
export function watchOnce<T extends Readonly<WatchSource<unknown>[]>, Immediate extends Readonly<boolean> = false>(source: [...T], cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>, options?: WatchOptions<Immediate>): WatchStopHandle

export function watchOnce<T, Immediate extends Readonly<boolean> = false>(sources: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchOptions<Immediate>): WatchStopHandle

// implementation
export function watchOnce<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options?: WatchOptions<Immediate>,
): WatchStopHandle {
  const stop = watch(source, (...args) => {
    nextTick(() => stop())

    return cb(...args)
  }, options)

  return stop
}
