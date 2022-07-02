import type { WatchCallback, WatchSource } from 'vue-demi'
import { isReactive, unref } from 'vue-demi'
import type { MapOldSources, MapSources } from '../utils'
import type { WatchIgnorableReturn } from '../watchIgnorable'
import { watchIgnorable } from '../watchIgnorable'
import type { WatchWithFilterOptions } from '../watchWithFilter'

// Watch that can be triggered manually
// A `watch` wrapper that supports manual triggering of `WatchCallback`, which returns an additional `trigger` to execute a `WatchCallback` immediately.

export interface WatchTriggerableReturn extends WatchIgnorableReturn {
  /** Execute `WatchCallback` immediately */
  trigger: () => void
}

export function watchTriggerable<T extends Readonly<WatchSource<unknown>[]>, Immediate extends Readonly<boolean> = false>(sources: [...T], cb: WatchCallback<MapSources<T>, MapOldSources<T, true>>, options?: WatchWithFilterOptions<Immediate>): WatchTriggerableReturn
export function watchTriggerable<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, cb: WatchCallback<T, T | undefined>, options?: WatchWithFilterOptions<Immediate>): WatchTriggerableReturn
export function watchTriggerable<T extends object, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<T, T | undefined>, options?: WatchWithFilterOptions<Immediate>): WatchTriggerableReturn

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

    cb(value, oldValue, onCleanup)
  }
  const res = watchIgnorable(source, _cb, options)
  const { ignoreUpdates } = res

  const trigger = () => {
    ignoreUpdates(() => {
      _cb(getWatchSources(source), getOldValue(source))
    })
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
