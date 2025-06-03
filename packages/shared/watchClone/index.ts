import type { WatchOptions } from 'vue'
import { isReactive, toValue, watch } from 'vue'
import { cloneFnJSON } from '../../core/useCloned'

type WatchParams = Parameters<typeof watch>

export type WatchCloneOptions = WatchOptions & {
  clone?: (val: any) => any
}

/**
 * Watch an object and return the isolated new and old values.
 *
 * @see https://vueuse.org/watchClone
 */
export function watchClone(
  source: WatchParams[0],
  cb: WatchParams[1],
  options?: WatchCloneOptions,
) {
  const val = toValue(source)
  const { clone = cloneFnJSON, ...watchOptions } = options || {}
  const deep = watchOptions.deep

  if (typeof val !== 'object' || val === null || (!deep && !isReactive(val))) {
    return watch(source, cb, watchOptions)
  }

  const cloneFn = typeof clone === 'function'
    ? clone
    : cloneFnJSON
  let oldVal = cloneFn(val)

  return watch(source, (newVal, _, onCleanup) => {
    cb(newVal, oldVal, onCleanup)
    oldVal = cloneFn(newVal)
  }, watchOptions)
}
