import type { ComponentInternalInstance } from 'vue-demi'
import { getCurrentInstance, onBeforeUnmount } from 'vue-demi'
import type { Fn } from '../utils'

/**
 * Call onBeforeUnmount() if it's inside a component lifecycle, if not, do nothing
 *
 * @param fn
 * @param target
 */
export function tryOnBeforeUnmount(fn: Fn, target?: ComponentInternalInstance | null) {
  const instance = target || getCurrentInstance()
  if (instance)
    onBeforeUnmount(fn, instance)
}
