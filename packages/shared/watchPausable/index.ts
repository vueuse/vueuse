import type { WatchCallback, WatchSource, WatchStopHandle } from 'vue-demi'
import type { MapOldSources, MapSources, Pausable } from '../utils'
import { pausableFilter } from '../utils'
import type { WatchWithFilterOptions } from '../watchWithFilter'
import { watchWithFilter } from '../watchWithFilter'

export interface WatchPausableReturn extends Pausable {
  stop: WatchStopHandle
}

// overloads
export function watchPausable<T extends Readonly<WatchSource<unknown>[]>, Immediate extends Readonly<boolean> = false>(sources: [...T], cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>, options?: WatchWithFilterOptions<Immediate>): WatchPausableReturn
export function watchPausable<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchWithFilterOptions<Immediate>): WatchPausableReturn
export function watchPausable<T extends object, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchWithFilterOptions<Immediate>): WatchPausableReturn

// implementation
export function watchPausable<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: WatchWithFilterOptions<Immediate> = {},
): WatchPausableReturn {
  const {
    eventFilter: filter,
    ...watchOptions
  } = options

  const { eventFilter, pause, resume, isActive } = pausableFilter(filter)
  const stop = watchWithFilter(
    source,
    cb,
    {
      ...watchOptions,
      eventFilter,
    },
  )

  return { stop, pause, resume, isActive }
}

// alias
export { watchPausable as pausableWatch }
