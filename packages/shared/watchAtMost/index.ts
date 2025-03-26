import type { MaybeRefOrGetter, ShallowRef, WatchCallback, WatchSource, WatchStopHandle } from 'vue'
import type { MapOldSources, MapSources } from '../utils'
import type { WatchWithFilterOptions } from '../watchWithFilter'
import { nextTick, shallowRef, toValue } from 'vue'
import { watchWithFilter } from '../watchWithFilter'

export interface WatchAtMostOptions<Immediate> extends WatchWithFilterOptions<Immediate> {
  count: MaybeRefOrGetter<number>
}

export interface WatchAtMostReturn {
  stop: WatchStopHandle
  count: ShallowRef<number>
}

// overloads
export function watchAtMost<T extends Readonly<WatchSource<unknown>[]>, Immediate extends Readonly<boolean> = false>(sources: [...T], cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>, options: WatchAtMostOptions<Immediate>): WatchAtMostReturn

export function watchAtMost<T, Immediate extends Readonly<boolean> = false>(sources: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options: WatchAtMostOptions<Immediate>): WatchAtMostReturn

// implementation
export function watchAtMost<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: WatchAtMostOptions<Immediate>,
): WatchAtMostReturn {
  const {
    count,
    ...watchOptions
  } = options

  const current = shallowRef(0)

  const stop = watchWithFilter(
    source,
    (...args) => {
      current.value += 1
      if (current.value >= toValue(count))
        nextTick(() => stop())

      cb(...args)
    },
    watchOptions,
  )

  return { count: current, stop }
}
