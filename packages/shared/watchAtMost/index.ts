import { Ref, readonly, watch, WatchSource, WatchOptions, WatchStopHandle, WatchCallback } from 'vue-demi'
import { MapOldSources, MapSources, createFilterWrapper, countFilter } from '../utils'

export interface WatchAtMostOptions<Immediate> extends WatchOptions<Immediate> {
  max: number
}

export interface WatchAtMostReturn {
  stop: WatchStopHandle
  count: Ref<number>
}
// overlads
export function watchAtMost<T extends Readonly<WatchSource<unknown>[]>, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>, options?: WatchAtMostOptions<Immediate>): WatchAtMostReturn

export function watchAtMost<T extends Readonly<WatchSource<unknown>[]>, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>, options?: WatchAtMostOptions<Immediate>): WatchAtMostReturn

export function watchAtMost<T, Immediate extends Readonly<boolean> = false>(sources: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchAtMostOptions<Immediate>): WatchAtMostReturn

// implementation
export function watchAtMost<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: WatchAtMostOptions<Immediate> = { max: 1 },
): WatchAtMostReturn {
  const {
    max,
    ...watchOptions
  } = options
  const { count, filter } = countFilter(max)
  const stop = watch(
    source,
    createFilterWrapper(filter, (...args) => {
      cb(...args)
      count.value >= max && stop()
    }),
    watchOptions,
  )
  return { count: readonly(count), stop }
}
