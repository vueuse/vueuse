import { unref } from 'vue-demi'
import type { AnyFn, MaybeComputedRef } from '../utils'

/**
 * Get the value of value/ref/getter.
 */
export function resolveUnref<T>(r: MaybeComputedRef<T>): T {
  return typeof r === 'function'
    ? (r as AnyFn)()
    : unref(r)
}
