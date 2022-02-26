import { toRefs } from 'vue-demi'
import { reactiveComputed } from '../reactiveComputed'

/**
 * Reactively omit fields from a reactive object
 *
 * @see https://vueuse.js.org/reactiveOmit
 */
export function reactiveOmit<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  return reactiveComputed<any>(() => Object.fromEntries(Object.entries(toRefs(obj)).filter(e => !keys.includes(e[0] as any))))
}
