import type { WatchCallback, WatchOptions, WatchSource } from 'vue-demi'
import { nextTick, watch } from 'vue-demi'
import type { MapOldSources, MapSources } from '../utils'

// overloads
export function watchOnce<T extends Readonly<WatchSource<unknown>[]>, Immediate extends Readonly<boolean> = false>(source: [...T], cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>, options?: WatchOptions<Immediate>): void

export function watchOnce<T, Immediate extends Readonly<boolean> = false>(sources: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchOptions<Immediate>): void

// implementation
export function watchOnce<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options?: WatchOptions<Immediate>,
): void {
  const stop = watch(source, (...args) => {
    nextTick(() => stop())

    return cb(...args)
  }, options)
}
