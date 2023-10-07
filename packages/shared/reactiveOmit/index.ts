import { toRefs } from 'vue-demi'
import { toValue } from '../toValue'
import { reactiveComputed } from '../reactiveComputed'

export type ReactiveOmitPredicate<T> = (value: T[keyof T], key: keyof T) => boolean

export function reactiveOmit<T extends object, K extends keyof T>(
  obj: T,
  ...keys: (K | K[])[]
): Omit<T, K>
export function reactiveOmit<T extends object>(
  obj: T,
  predicate: ReactiveOmitPredicate<T>,
): Partial<T>
/**
 * Reactively omit fields from a reactive object
 *
 * @see https://vueuse.org/reactiveOmit
 */
export function reactiveOmit<T extends object, K extends keyof T>(
  obj: T,
  ...keys: (K | K[])[]
): Omit<T, K> {
  const flatKeys = keys.flat() as K[]
  const predicate = flatKeys[0] as unknown as ReactiveOmitPredicate<T>
  return reactiveComputed<any>(() =>
    typeof predicate === 'function'
      ? Object.fromEntries(Object.entries(toRefs(obj)).filter(([k, v]) => !predicate(toValue(v) as T[K], k as K)))
      : Object.fromEntries(Object.entries(toRefs(obj)).filter(e => !flatKeys.includes(e[0] as any))))
}
