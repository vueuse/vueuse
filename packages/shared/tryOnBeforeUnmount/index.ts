import { onBeforeUnmount } from 'vue-demi'
import { type Fn, getLifeCycleTarget } from '../utils'

/**
 * Call onBeforeUnmount() if it's inside a component lifecycle, if not, do nothing
 *
 * @param fn
 * @param target
 */
export function tryOnBeforeUnmount(fn: Fn, target?: any) {
  const instance = getLifeCycleTarget(target)
  if (instance)
    onBeforeUnmount(fn, target)
}
