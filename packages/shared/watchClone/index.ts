import type { WatchOptions } from 'vue'
import type { UseClonedOptions } from '../../core/useCloned'
import { toValue, watch } from 'vue'
import { useCloned } from '../../core/useCloned'

type WatchParams = Parameters<typeof watch>

export interface WatchCloneOptions {
  watchOptions?: WatchOptions
  useClonedOptions?: UseClonedOptions
}

/**
 * Watch an object and return the isolated new and old values.
 *
 * @see https://vueuse.org/watchClone
 */
export function watchClone(
  source: WatchParams[0],
  cb: WatchParams[1],
  options: WatchCloneOptions = {},
) {
  const { watchOptions = {}, useClonedOptions = {} } = options
  const { cloned } = useCloned(() => toValue(source), useClonedOptions)
  return watch(cloned, cb, watchOptions)
}
