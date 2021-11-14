import { Ref, watch, WatchSource } from 'vue-demi'
import { ConfigurableFlushSync } from '../utils'

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
}

/**
 * Keep target ref(s) in sync with the source ref
 *
 * @param source source ref
 * @param targets
 */
export function syncRef<T>(
  source: WatchSource<T>,
  targets: Ref<T> | Ref<T>[],
  {
    flush = 'sync',
    deep = false,
    immediate = true,
  }: SyncRefOptions = {}) {
  if (!Array.isArray(targets))
    targets = [targets]

  return watch(
    source,
    newValue => (targets as Ref<T>[]).forEach(target => target.value = newValue),
    { flush, deep, immediate },
  )
}
