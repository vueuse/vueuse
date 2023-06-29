// eslint-disable-next-line no-restricted-imports
import { type ComponentInternalInstance, getCurrentInstance, onUnmounted } from 'vue-demi'
import type { Fn } from '../utils'

/**
 * Call onUnmounted() if it's inside a component lifecycle, if not, do nothing
 *
 * @param fn
 * @param target
 */
export function tryOnUnmounted(fn: Fn, target?: ComponentInternalInstance | null) {
  const instance = target || getCurrentInstance()
  if (instance)
    onUnmounted(fn, instance)
}
