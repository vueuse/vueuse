import type { ComputedRef, Ref } from 'vue-demi'
import { computed, ref } from 'vue-demi'
import type { MaybeComputedRef, MaybeRef } from '../utils'

/**
 * Normalize value/ref/getter to `ref` or `computed`.
 */
export function toRef<T>(r: MaybeComputedRef<T>): ComputedRef<T>
export function toRef<T>(r: MaybeRef<T>): Ref<T>
export function toRef<T>(r: T): Ref<T>
export function toRef<T>(r: MaybeComputedRef<T>) {
  return typeof r === 'function'
    ? computed<T>(r as any)
    : ref(r)
}

export {
  /**
   * @deprecated use `toRef` instead
   */
  toRef as resolveRef,
}
