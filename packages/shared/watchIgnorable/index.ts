import type { MultiWatchSources, WatchCallback, WatchSource, WatchStopHandle } from 'vue'
import type { Fn, MapOldSources, MapSources } from '../utils'
import type { WatchWithFilterOptions } from '../watchWithFilter'
import { watch } from 'vue'
import { bypassFilter, createFilterWrapper } from '../utils'

// watchIgnorable(source,callback,options) composable
//
// Extended watch that exposes a ignoreUpdates(updater) function that allows to update the source without triggering effects

export type IgnoredUpdater = (updater: () => void) => void
export type IgnoredPrevAsyncUpdates = () => void

export interface WatchIgnorableReturn {
  ignoreUpdates: IgnoredUpdater
  ignorePrevAsyncUpdates: IgnoredPrevAsyncUpdates
  stop: WatchStopHandle
}

export function watchIgnorable<T extends Readonly<MultiWatchSources>, Immediate extends Readonly<boolean> = false>(sources: [...T], cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>, options?: WatchWithFilterOptions<Immediate>): WatchIgnorableReturn
export function watchIgnorable<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchWithFilterOptions<Immediate>): WatchIgnorableReturn
export function watchIgnorable<T extends object, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchWithFilterOptions<Immediate>): WatchIgnorableReturn

export function watchIgnorable<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: WatchWithFilterOptions<Immediate> = {},
): WatchIgnorableReturn {
  const {
    eventFilter = bypassFilter,
    ...watchOptions
  } = options

  const filteredCb = createFilterWrapper(
    eventFilter,
    cb,
  )

  let ignoreUpdates: IgnoredUpdater
  let ignorePrevAsyncUpdates: IgnoredPrevAsyncUpdates
  let stop: WatchStopHandle

  if (watchOptions.flush === 'sync') {
    let ignore = false

    // no op for flush: sync
    ignorePrevAsyncUpdates = () => {}

    ignoreUpdates = (updater: () => void) => {
      // Call the updater function and count how many sync updates are performed,
      // then add them to the ignore count
      ignore = true
      updater()
      ignore = false
    }

    stop = watch(
      source,
      (...args) => {
        if (!ignore)
          filteredCb(...args)
      },
      watchOptions,
    )
  }
  else {
    // flush 'pre' and 'post'

    const disposables: Fn[] = []

    // counters for how many following changes to be ignored
    // ignoreCounter is incremented before there is a history operation
    // affecting the source ref value (undo, redo, revert).
    // syncCounter is incremented in sync with every change to the
    // source ref value. This let us know how many times the ref
    // was modified and support chained sync operations. If there
    // are more sync triggers than the ignore count, the we now
    // there are modifications in the source ref value that we
    // need to commit
    let ignoreCounter = 0
    let syncCounter = 0

    ignorePrevAsyncUpdates = () => {
      ignoreCounter = syncCounter
    }

    // Sync watch to count modifications to the source
    disposables.push(
      watch(
        source,
        () => {
          syncCounter++
        },
        { ...watchOptions, flush: 'sync' },
      ),
    )

    ignoreUpdates = (updater: () => void) => {
      // Call the updater function and count how many sync updates are performed,
      // then add them to the ignore count
      const syncCounterPrev = syncCounter
      updater()
      ignoreCounter += syncCounter - syncCounterPrev
    }

    disposables.push(
      watch(
        source,
        (...args) => {
          // If a history operation was performed (ignoreCounter > 0) and there are
          // no other changes to the source ref value afterwards, then ignore this commit
          const ignore = ignoreCounter > 0 && ignoreCounter === syncCounter
          ignoreCounter = 0
          syncCounter = 0
          if (ignore)
            return

          filteredCb(...args)
        },
        watchOptions,
      ),
    )

    stop = () => {
      disposables.forEach(fn => fn())
    }
  }

  return { stop, ignoreUpdates, ignorePrevAsyncUpdates }
}

/** @deprecated use `watchIgnorable` instead */
export const ignorableWatch = watchIgnorable
