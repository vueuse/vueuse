import type { ComputedRef, Ref, ShallowRef } from 'vue-demi'
import {
  isRef,
  shallowRef,
} from 'vue-demi'
import type { MaybeRefOrGetter } from '../utils'
import { toRef } from '../'

/**
 * Normalize value/ref/getter to `shallowRef` or `computed`.
 */
export function toShallowRef<T>(r: () => T): Readonly<Ref<T>>
export function toShallowRef<T>(r: ComputedRef<T>): ComputedRef<T>
export function toShallowRef<T>(r: Ref<T>): Ref<T>
export function toShallowRef<T>(r: MaybeRefOrGetter<T>): Ref<T>
export function toShallowRef<T>(r: T): ShallowRef<T>
export function toShallowRef<T>(r: MaybeRefOrGetter<T>) {
  return (isRef(r) || typeof r === 'function')
    ? toRef(r)
    : shallowRef(r)
}
