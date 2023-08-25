import type { Ref } from 'vue-demi'
import type { ConfigurableFlushSync } from '../utils'
import type { WatchPausableReturn } from '../watchPausable'
import { pausableWatch } from '../watchPausable'

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
 */
export function syncRef<L, R = L>(left: Ref<L>, right: Ref<R>, options: SyncRefOptions<L, R> = {}) {
  const {
    flush = 'sync',
    deep = false,
    immediate = true,
    direction = 'both',
    transform = {},
  } = options

  const watchers: WatchPausableReturn[] = []

  const transformLTR = transform.ltr ?? (v => v)
  const transformRTL = transform.rtl ?? (v => v)

  if (direction === 'both' || direction === 'ltr') {
    watchers.push(pausableWatch(
      left,
      (newValue) => {
        watchers.forEach(w => w.pause())
        right.value = transformLTR(newValue) as R
        watchers.forEach(w => w.resume())
      },
      { flush, deep, immediate },
    ))
  }

  if (direction === 'both' || direction === 'rtl') {
    watchers.push(pausableWatch(
      right,
      (newValue) => {
        watchers.forEach(w => w.pause())
        left.value = transformRTL(newValue) as L
        watchers.forEach(w => w.resume())
      },
      { flush, deep, immediate },
    ))
  }

  const stop = () => {
    watchers.forEach(w => w.stop())
  }

  return stop
}
