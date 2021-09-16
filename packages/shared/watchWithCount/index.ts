import { Ref, readonly, watch, WatchSource, WatchOptions, WatchStopHandle, WatchCallback } from 'vue-demi'
import { MapOldSources, MapSources, createFilterWrapper, countFilter } from '../utils'

export interface WatchWithCountOptions<Immediate> extends WatchOptions<Immediate> {
  max: number
}

export interface WatchWithCountReturn {
  stop: WatchStopHandle
  count: Ref<number>
}
// overlads
export function watchWithCount<T extends Readonly<WatchSource<unknown>[]>, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>, options?: WatchWithCountOptions<Immediate>): WatchWithCountReturn

export function watchWithCount<T extends Readonly<WatchSource<unknown>[]>, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>, options?: WatchWithCountOptions<Immediate>): WatchWithCountReturn

export function watchWithCount<T, Immediate extends Readonly<boolean> = false>(sources: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchWithCountOptions<Immediate>): WatchWithCountReturn

// implementation
export function watchWithCount<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: WatchWithCountOptions<Immediate> = { max: 1 },
): WatchWithCountReturn {
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
