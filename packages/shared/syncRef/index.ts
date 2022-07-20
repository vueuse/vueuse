import type { WatchPausableReturn } from '@vueuse/shared'
import { pausableWatch } from '@vueuse/shared'
import type { Ref, UnwrapRef } from 'vue-demi'
import type { ConfigurableFlushSync } from '../utils'

export interface SyncRefOptions<T> extends ConfigurableFlushSync {
  /**
   * Watch deeply
   *
   * @default false
   */
  deep?: boolean
  /**
   * Sync values immediately
   *
   * @default true
   */
  immediate?: boolean

  /**
   * Direction of syncing. Value will be redefined if you define syncConvertors
   *
   * @default 'both'
   */
  direction?: 'ltr' | 'rtl' | 'both'
  /**
   * Sync function which converts values before sync.
   */
  syncConvertors?: {
    ltr?: (left: Ref<T>, right: Ref<T>) => T
    rtl?: (left: Ref<T>, right: Ref<T>) => T
  }
}

/**
 * Two-way refs synchronization.
 *
 * @param left
 * @param right
 */
export function syncRef<R extends Ref>(left: R, right: R, options: SyncRefOptions<UnwrapRef<R>> = {}) {
  const {
    flush = 'sync',
    deep = false,
    immediate = true,
    syncConvertors = {},
  } = options

  let watchLeft: WatchPausableReturn, watchRight: WatchPausableReturn

  let { direction = 'both' } = options

  if (syncConvertors.ltr || syncConvertors.rtl) {
    if (syncConvertors.ltr && syncConvertors.rtl)
      direction = 'both'

    else if (syncConvertors.ltr)
      direction = 'ltr'

    else
      direction = 'rtl'
  }

  function sync() {
    if (direction === 'ltr' || direction === 'both')
      right.value = syncConvertors.ltr ? syncConvertors.ltr(left, right) : left.value
    else
      left.value = syncConvertors.rtl ? syncConvertors.rtl(left, right) : right.value
  }

  if (immediate)
    sync()

  if (direction === 'both' || direction === 'ltr') {
    watchLeft = pausableWatch(
      left,
      (newValue) => {
        if (!syncConvertors.ltr) {
          right.value = newValue

          return
        }

        watchRight?.pause()

        right.value = syncConvertors.ltr(left, right)

        watchRight?.resume()
      },
      { flush, deep },
    )
  }

  if (direction === 'both' || direction === 'rtl') {
    watchRight = pausableWatch(
      right,
      (newValue) => {
        if (!syncConvertors.rtl) {
          left.value = newValue

          return
        }

        watchLeft?.pause()

        left.value = syncConvertors.rtl(left, right)

        watchLeft?.resume()
      },
      { flush, deep },
    )
  }

  return () => {
    watchLeft?.stop()
    watchRight?.stop()
  }
}
