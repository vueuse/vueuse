import type { WatchSource } from 'vue-demi'
import { isReactive, unref } from 'vue-demi'
import type { MapOldSources, MapSources } from '../utils'
import type { WatchIgnorableReturn } from '../watchIgnorable'
import { watchIgnorable } from '../watchIgnorable'
import type { WatchWithFilterOptions } from '../watchWithFilter'

// Watch that can be triggered manually
// A `watch` wrapper that supports manual triggering of `WatchCallback`, which returns an additional `trigger` to execute a `WatchCallback` immediately.

export interface WatchTriggerableReturn<FnReturnT = void> extends WatchIgnorableReturn {
  /** Execute `WatchCallback` immediately */
  trigger: () => FnReturnT
}

type OnCleanup = (cleanupFn: () => void) => void

export type WatchTriggerableCallback<V = any, OV = any, R = void> = (value: V, oldValue: OV, onCleanup: OnCleanup) => R

export function watchTriggerable<T extends Readonly<WatchSource<unknown>[]>, FnReturnT>(sources: [...T], cb: WatchTriggerableCallback<MapSources<T>, MapOldSources<T, true>, FnReturnT>, options?: WatchWithFilterOptions<boolean>): WatchTriggerableReturn<FnReturnT>
export function watchTriggerable<T, FnReturnT>(source: WatchSource<T>, cb: WatchTriggerableCallback<T, T | undefined, FnReturnT>, options?: WatchWithFilterOptions<boolean>): WatchTriggerableReturn<FnReturnT>
export function watchTriggerable<T extends object, FnReturnT>(source: T, cb: WatchTriggerableCallback<T, T | undefined, FnReturnT>, options?: WatchWithFilterOptions<boolean>): WatchTriggerableReturn<FnReturnT>

export function watchTriggerable<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: WatchWithFilterOptions<Immediate> = {},
): WatchTriggerableReturn {
  let cleanupFn: (() => void) | undefined

  function onEffect() {
    if (!cleanupFn)
      return

    const fn = cleanupFn
    cleanupFn = undefined
    fn()
  }

  /** Register the function `cleanupFn` */
  function onCleanup(callback: () => void) {
    cleanupFn = callback
  }

  const _cb = (
    value: any,
    oldValue: any,
  ) => {
    // When a new side effect occurs, clean up the previous side effect
    onEffect()

    return cb(value, oldValue, onCleanup)
  }
  const res = watchIgnorable(source, _cb, options)
  const { ignoreUpdates } = res

  const trigger = () => {
    let res: any
    ignoreUpdates(() => {
      res = _cb(getWatchSources(source), getOldValue(source))
    })
    return res
  }

  return {
    ...res,
    trigger,
  }
}

function getWatchSources(sources: any) {
  if (isReactive(sources))
    return sources
  if (Array.isArray(sources))
    return sources.map(item => getOneWatchSource(item))
  return getOneWatchSource(sources)
}

function getOneWatchSource(source: Readonly<WatchSource<unknown>>) {
  return typeof source === 'function'
    ? source()
    : unref(source)
}

// For calls triggered by trigger, the old value is unknown, so it cannot be returned
function getOldValue(source: any) {
  return Array.isArray(source)
    ? source.map(() => undefined)
    : undefined
}
