import type { Ref, UnwrapRef, WatchStopHandle } from 'vue-demi'
import { watch } from 'vue-demi'
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
   * Custom transform function
   */
  transform?: {
    ltr?: (left: T) => T
    rtl?: (right: T) => T
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
    direction = 'both',
    transform = {},
  } = options

  let watchLeft: WatchStopHandle
  let watchRight: WatchStopHandle

  const transformLTR = transform.ltr ?? (v => v)
  const transformRTL = transform.rtl ?? (v => v)

  function sync() {
    if (direction === 'ltr' || direction === 'both')
      right.value = transformLTR(left.value)
    else
      left.value = transformRTL(right.value)
  }

  if (immediate)
    sync()

  if (direction === 'both' || direction === 'ltr') {
    watchLeft = watch(
      left,
      newValue => right.value = transformLTR(newValue),
      { flush, deep },
    )
  }

  if (direction === 'both' || direction === 'rtl') {
    watchRight = watch(
      right,
      newValue => left.value = transformRTL(newValue),
      { flush, deep },
    )
  }

  return () => {
    watchLeft?.()
    watchRight?.()
  }
}
