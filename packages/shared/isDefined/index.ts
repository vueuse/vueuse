import type { ComputedRef, Ref } from 'vue'

// eslint-disable-next-line no-restricted-imports
import { unref } from 'vue'

export type IsDefinedReturn = boolean

export function isDefined<T>(v: ComputedRef<T>): v is ComputedRef<Exclude<T, null | undefined>>
export function isDefined<T>(v: Ref<T>): v is Ref<Exclude<T, null | undefined>>
export function isDefined<T>(v: T): v is Exclude<T, null | undefined>
export function isDefined<T>(v: Ref<T>): IsDefinedReturn {
  return unref(v) != null
}
