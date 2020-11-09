import { Ref, WatchOptions, watch } from 'vue-demi'

export interface SyncRefOptions {
  /**
   * Timing for syncing, same as watch's flush option
   *
   * @default 'sync'
   */
  flush?: WatchOptions['flush']
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
export function syncRef<R extends Ref<any>>(source: R, targets: R | R[], {
  flush = 'sync',
  deep = false,
  immediate = true,
}: SyncRefOptions = {}) {
  if (!Array.isArray(targets))
    targets = [targets]

  return watch(source, (newValue) => {
    (targets as R[]).forEach(target => target.value = newValue)
  }, {
    flush,
    deep,
    immediate,
  })
}
