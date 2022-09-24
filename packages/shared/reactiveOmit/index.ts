import { toRefs } from 'vue-demi'
import { reactiveComputed } from '../reactiveComputed'

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
  return reactiveComputed<any>(() => Object.fromEntries(Object.entries(toRefs(obj)).filter(e => !flatKeys.includes(e[0] as any))))
}
