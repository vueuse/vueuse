import type { Ref, WatchSource } from 'vue'
import { watch } from 'vue'
import { type ConfigurableFlushSync, toArray } from '../utils'

export interface SyncRefsOptions extends ConfigurableFlushSync {
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
}

/**
 * Keep target ref(s) in sync with the source ref
 *
 * @param source source ref
 * @param targets
 */
export function syncRefs<T>(
  source: WatchSource<T>,
  targets: Ref<T> | Ref<T>[],
  options: SyncRefsOptions = {},
) {
  const {
    flush = 'sync',
    deep = false,
    immediate = true,
  } = options
  targets = toArray(targets)

  return watch(
    source,
    newValue => (targets as Ref<T>[]).forEach(target => target.value = newValue),
    { flush, deep, immediate },
  )
}
