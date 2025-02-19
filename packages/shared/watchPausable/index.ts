import type { WatchCallback, WatchSource, WatchStopHandle } from 'vue'
import type { MapOldSources, MapSources, Pausable, PausableFilterOptions } from '../utils'
import type { WatchWithFilterOptions } from '../watchWithFilter'
import { pausableFilter } from '../utils'
import { watchWithFilter } from '../watchWithFilter'

export interface WatchPausableReturn extends Pausable {
  stop: WatchStopHandle
}

export type WatchPausableOptions<Immediate> = WatchWithFilterOptions<Immediate> & PausableFilterOptions

export function watchPausable<T extends Readonly<WatchSource<unknown>[]>, Immediate extends Readonly<boolean> = false>(sources: [...T], cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>, options?: WatchPausableOptions<Immediate>): WatchPausableReturn
export function watchPausable<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchPausableOptions<Immediate>): WatchPausableReturn
export function watchPausable<T extends object, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchPausableOptions<Immediate>): WatchPausableReturn
export function watchPausable<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: WatchPausableOptions<Immediate> = {},
): WatchPausableReturn {
  const {
    eventFilter: filter,
    initialState = 'active',
    ...watchOptions
  } = options

  const { eventFilter, pause, resume, isActive } = pausableFilter(filter, { initialState })
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
