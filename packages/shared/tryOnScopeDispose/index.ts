import { getCurrentScope, onScopeDispose } from 'vue-demi'
import { Fn } from '../utils'

/**
 * Call onScopeDispose() if it's inside a component lifecycle, if not, run just call the function
 *
 * @param fn
 */
export function tryOnScopeDispose(fn: Fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn)
    return true
  }
  return false
}
