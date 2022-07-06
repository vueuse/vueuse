import { unref } from 'vue-demi'
import type { MaybeComputedRef } from '../utils'

/**
 * Normalize value/ref/getter to `ref` or `computed`.
 */
export function resolveUnref<T>(r: MaybeComputedRef<T>): T {
  return typeof r === 'function'
    ? (r as any)()
    : unref(r)
}
