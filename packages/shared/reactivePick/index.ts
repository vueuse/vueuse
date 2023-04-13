import type { UnwrapRef } from 'vue-demi'
import { toRefs } from 'vue-demi'
import { toRef } from '../toRef'
import { reactiveComputed } from '../reactiveComputed'
import { toValue } from '../toValue'

export type ReactivePickPredicate<T> = (value: T[keyof T], key: keyof T) => boolean

export function reactivePick<T extends object, K extends keyof T>(
  obj: T,
  ...keys: (K | K[])[]
): { [S in K]: UnwrapRef<T[S]> }
export function reactivePick<T extends object>(
  obj: T,
  predicate: ReactivePickPredicate<T>
): { [S in keyof T]?: UnwrapRef<T[S]> }

/**
 * Reactively pick fields from a reactive object
 *
 * @see https://vueuse.org/reactivePick
 */
export function reactivePick<T extends object, K extends keyof T>(
  obj: T,
  ...keys: (K | K[])[]
): { [S in K]: UnwrapRef<T[S]> } {
  const flatKeys = keys.flat() as K[]
  const predicate = flatKeys[0] as unknown as ReactivePickPredicate<T>
  return reactiveComputed(() => typeof predicate === 'function' ? Object.fromEntries(Object.entries(toRefs(obj)).filter(([k, v]) => predicate(toValue(v) as T[K], k as K))) : Object.fromEntries(flatKeys.map(k => [k, toRef(obj, k)]))) as any
}
