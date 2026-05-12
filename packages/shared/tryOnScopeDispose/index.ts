import type { Fn } from '../utils'
import { getCurrentScope, onScopeDispose } from 'vue'

/**
 * Call onScopeDispose() if it's inside an effect scope lifecycle, if not, do nothing
 *
 * @param fn
 */
export function tryOnScopeDispose(fn: Fn, failSilently?: boolean): boolean {
  if (getCurrentScope()) {
    onScopeDispose(fn, failSilently)
    return true
  }
  return false
}
