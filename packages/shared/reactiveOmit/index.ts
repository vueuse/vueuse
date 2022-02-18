import type { UnwrapRef } from 'vue-demi'
import { reactivePick } from '../reactivePick'

/**
 * Reactively omit fields from a reactive object
 *
 * @see https://vueuse.js.org/reactiveOmit
 */
export function reactiveOmit<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): { [S in Exclude<keyof T, K>]: UnwrapRef<T[S]>; } {
  const pickKeys = Object.keys(obj).filter(k => !keys.includes(k as any)) as Array<Exclude<keyof T, K>>

  return reactivePick(obj, ...pickKeys)
}
