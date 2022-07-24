import type { Ref, WatchStopHandle } from 'vue-demi'
import { watch } from 'vue-demi'
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
 */
export function syncRef<L, R = L>(left: Ref<L>, right: Ref<R>, options: SyncRefOptions<L, R> = {}) {
  const {
    flush = 'sync',
    deep = false,
    immediate = true,
    direction = 'both',
    transform = {},
  } = options

  let watchLeft: WatchStopHandle
  let watchRight: WatchStopHandle

  const transformLTR = transform.ltr ?? (v => v)
  const transformRTL = transform.rtl ?? (v => v)

  if (direction === 'both' || direction === 'ltr') {
    watchLeft = watch(
      left,
      newValue => right.value = transformLTR(newValue) as R,
      { flush, deep, immediate },
    )
  }

  if (direction === 'both' || direction === 'rtl') {
    watchRight = watch(
      right,
      newValue => left.value = transformRTL(newValue) as L,
      { flush, deep, immediate },
    )
  }

  return () => {
    watchLeft?.()
    watchRight?.()
  }
}
