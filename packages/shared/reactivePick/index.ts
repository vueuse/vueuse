import type { UnwrapRef } from 'vue-demi'
import { reactive, toRef } from 'vue-demi'

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
  return reactive(Object.fromEntries(flatKeys.map(k => [k, toRef(obj, k)]))) as any
}
