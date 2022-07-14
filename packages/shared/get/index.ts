import { unref } from 'vue-demi'
import type { MaybeComputedRef } from '../utils'

/**
 * Shorthand for accessing `ref.value`
 */
export function get<T>(ref: MaybeComputedRef<T>): T
export function get<T, K extends keyof T>(ref: MaybeComputedRef<T>, key: K): T[K]

export function get(obj: MaybeComputedRef<any>, key?: string | number | symbol) {
  if (key == null)
    return unref(obj)

  return unref(obj)[key]
}
