import { WatchSource, WatchCallback, WatchOptions } from 'vue-demi'
import { MapOldSources, MapSources } from '../utils'
import { watchAtMost } from '../watchAtMost'
export interface WatchOnceOptions<Immediate> extends WatchOptions<Immediate> {
}

// overlads
export function watchOnce<T extends Readonly<WatchSource<unknown>[]>, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>, options?: WatchOnceOptions<Immediate>): void

export function watchOnce<T extends Readonly<WatchSource<unknown>[]>, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>, options?: WatchOnceOptions<Immediate>): void

export function watchOnce<T, Immediate extends Readonly<boolean> = false>(sources: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchOnceOptions<Immediate>): void

// implementation
export function watchOnce<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options?: WatchOnceOptions<Immediate>,
): void {
  watchAtMost(source, cb, {
    ...options,
    count: 1,
  })
}
