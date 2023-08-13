import { pausableWatch } from '@vueuse/core'
import type { WatchPausableReturn } from '@vueuse/core'
import type { Ref } from 'vue-demi'
import type { ConfigurableFlushSync } from '../utils'

export interface SyncRefOptions<L, R = L> extends ConfigurableFlushSync {
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
   * Custom transform function
   */
  transform?: {
    ltr?: (left: L) => R
    rtl?: (right: R) => L
  }
}

/**
 * Two-way refs synchronization.
 *
 * @param left
 * @param right
 * @param options
 */
export function syncRef<L, R = L>(left: Ref<L>, right: Ref<R>, options: SyncRefOptions<L, R> = {}) {
  const {
    flush = 'sync',
    deep = false,
    immediate = true,
    direction = 'both',
    transform = {},
  } = options

  let watchLeft: WatchPausableReturn
  let watchRight: WatchPausableReturn

  const transformLTR = transform.ltr ?? (v => v)
  const transformRTL = transform.rtl ?? (v => v)

  if (direction === 'both' || direction === 'ltr') {
    watchLeft = pausableWatch(
      left,
      (newValue) => {
        watchRight?.pause()
        right.value = transformLTR(newValue) as R
        watchRight?.resume()
      },
      { flush, deep, immediate },
    )
  }

  if (direction === 'both' || direction === 'rtl') {
    watchRight = pausableWatch(
      right,
      (newValue) => {
        watchLeft?.pause()
        left.value = transformRTL(newValue) as L
        watchLeft?.resume()
      },
      { flush, deep, immediate },
    )
  }

  return () => {
    watchLeft?.stop()
    watchRight?.stop()
  }
}
