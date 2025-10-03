import type { ComponentInternalInstance } from 'vue'
import type { Fn } from '../utils'
// eslint-disable-next-line no-restricted-imports
import { nextTick, onMounted } from 'vue'
import { getLifeCycleTarget } from '../utils'

/**
 * Call onMounted() if it's inside a component lifecycle, if not, just call the function
 *
 * @param fn
 * @param sync if set to false, it will run in the nextTick() of Vue
 * @param target
 */
export function tryOnMounted(fn: Fn, sync = true, target?: ComponentInternalInstance | null) {
  const instance = getLifeCycleTarget(target)
  if (instance)
    onMounted(fn, target)
  else if (sync)
    fn()
  else
    nextTick(fn)
}
