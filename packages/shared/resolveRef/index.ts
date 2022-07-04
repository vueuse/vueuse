import type { ComputedRef, Ref } from 'vue-demi'
import { computed, ref } from 'vue-demi'

/**
 * Maybe it's a ref, or a plain value
 *
 * ```ts
 * type MaybeRef<T> = T | Ref<T>
 * ```
 */
export type MaybeRef<T> = T | Ref<T>

/**
 * Maybe it's a ref, or a getter function
 *
 * ```ts
 * type MaybeRef<T> = T | Ref<T>
 * ```
 */
export type MaybeComputedRef<T> = T extends Function
  ? never
  : (() => T) | MaybeRef<T>

/**
 * Normalize value/ref/getter to `ref` or `computed`.
 */
export function resolveRef<T>(r: MaybeComputedRef<T>): ComputedRef<T>
export function resolveRef<T>(r: MaybeRef<T>): Ref<T>
export function resolveRef<T>(r: MaybeComputedRef<T>) {
  return typeof r === 'function'
    ? computed<T>(r as any)
    : ref(r)
}

