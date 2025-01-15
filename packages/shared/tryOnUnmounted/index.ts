import type { Fn } from '../utils'
// eslint-disable-next-line no-restricted-imports
import { onUnmounted } from 'vue'
import { getLifeCycleTarget } from '../utils'

/**
 * Call onUnmounted() if it's inside a component lifecycle, if not, do nothing
 *
 * @param fn
 * @param target
 */
export function tryOnUnmounted(fn: Fn, target?: any) {
  const instance = getLifeCycleTarget(target)
  if (instance)
    onUnmounted(fn, target)
}
