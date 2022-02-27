import type { Ref } from 'vue-demi'
import { watch } from 'vue-demi'
import type { ConfigurableFlushSync } from '../utils'

export interface SyncRefOptions extends ConfigurableFlushSync {
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
   * Direction of syncing
   *
   * @default 'both'
   */
  direction?: 'ltr' | 'rtl' | 'both'
}

/**
 * Two-way refs synchronization.
 *
 * @param left
 * @param right
 */
export function syncRef<R extends Ref<any>>(left: R, right: R, options: SyncRefOptions = {}) {
  const {
    flush = 'sync',
    deep = false,
    immediate = true,
    direction = 'both',
  } = options

  let stop1: Function, stop2: Function

  if (direction === 'both' || direction === 'ltr') {
    stop1 = watch(
      left,
      newValue => right.value = newValue,
      { flush, deep, immediate },
    )
  }

  if (direction === 'both' || direction === 'rtl') {
    stop2 = watch(
      right,
      newValue => left.value = newValue,
      { flush, deep, immediate },
    )
  }

  return () => {
    stop1?.()
    stop2?.()
  }
}
