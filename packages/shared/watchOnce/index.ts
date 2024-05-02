import type { WatchCallback, WatchOptions, WatchSource, WatchStopHandle } from 'vue-demi'
import { nextTick, watch } from 'vue-demi'
import type { MapOldSources, MapSources } from '../utils'

interface WatchOnceOptions<Callback extends WatchCallback, Immediate extends boolean> extends WatchOptions<Immediate> {
  readonly until?: (...args: Parameters<Callback>) => boolean
}

// overloads
export function watchOnce<T extends Readonly<WatchSource<unknown>[]>, Immediate extends Readonly<boolean> = false>(
  source: [...T],
  cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>,
  options?: WatchOnceOptions<typeof cb, Immediate>,
): WatchStopHandle

export function watchOnce<T, Immediate extends Readonly<boolean> = false>(
  sources: WatchSource<T>,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchOnceOptions<typeof cb, Immediate>,
): WatchStopHandle

// implementation
export function watchOnce<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options?: WatchOnceOptions<typeof cb, Immediate>,
): WatchStopHandle {
  const stop = watch(source, (...args) => {
    if (!options?.until || options.until(...args)) {
      nextTick(() => stop())

      return cb(...args)
    }
  }, options)

  return stop
}
