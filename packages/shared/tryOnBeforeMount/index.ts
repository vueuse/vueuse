import { type ComponentInternalInstance, getCurrentInstance, nextTick, onBeforeMount } from 'vue-demi'
import type { Fn } from '../utils'

/**
 * Call onBeforeMount() if it's inside a component lifecycle, if not, just call the function
 *
 * @param fn
 * @param sync if set to false, it will run in the nextTick() of Vue
 * @param target
 */
export function tryOnBeforeMount(fn: Fn, sync = true, target?: ComponentInternalInstance | null) {
  const instance = target || getCurrentInstance()
  if (instance)
    onBeforeMount(fn, instance)
  else if (sync)
    fn()
  else
    nextTick(fn)
}
