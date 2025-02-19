import type { Fn } from '../utils'
import { nextTick, onBeforeMount } from 'vue'
import { getLifeCycleTarget } from '../utils'

/**
 * Call onBeforeMount() if it's inside a component lifecycle, if not, just call the function
 *
 * @param fn
 * @param sync if set to false, it will run in the nextTick() of Vue
 * @param target
 */
export function tryOnBeforeMount(fn: Fn, sync = true, target?: any) {
  const instance = getLifeCycleTarget(target)
  if (instance)
    onBeforeMount(fn, target)
  else if (sync)
    fn()
  else
    nextTick(fn)
}
