import type { MultiWatchSources, WatchCallback, WatchSource, WatchStopHandle } from 'vue'
import type { MapOldSources, MapSources, Pausable, PausableFilterOptions } from '../utils'
import type { WatchWithFilterOptions } from '../watchWithFilter'
import { pausableFilter } from '../utils'
import { watchWithFilter } from '../watchWithFilter'

export interface WatchPausableReturn extends Pausable {
  stop: WatchStopHandle
}

export type WatchPausableOptions<Immediate> = WatchWithFilterOptions<Immediate> & PausableFilterOptions

/** @deprecated Use Vue's built-in `watch` instead. This function will be removed in future version. */
export function watchPausable<T extends Readonly<MultiWatchSources>, Immediate extends Readonly<boolean> = false>(sources: [...T], cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>, options?: WatchPausableOptions<Immediate>): WatchPausableReturn
/** @deprecated Use Vue's built-in `watch` instead. This function will be removed in future version. */
export function watchPausable<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchPausableOptions<Immediate>): WatchPausableReturn
/** @deprecated Use Vue's built-in `watch` instead. This function will be removed in future version. */
export function watchPausable<T extends object, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchPausableOptions<Immediate>): WatchPausableReturn
/** @deprecated Use Vue's built-in `watch` instead. This function will be removed in future version. */
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

/** @deprecated Use Vue's built-in `watch` instead. This function will be removed in future version. */
export const pausableWatch = watchPausable
