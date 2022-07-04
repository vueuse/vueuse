import type { UnwrapRef } from 'vue-demi'
import { reactive, toRef } from 'vue-demi'
import { Many } from '../utils'

/**
 * Reactively pick fields from a reactive object
 *
 * @see https://vueuse.js.org/reactivePick
 */
export function reactivePick<T extends object, K extends keyof T>(
  obj: T,
  ...keys: Array<Many<K>>
): { [S in K]: UnwrapRef<T[S]> } {
  return reactive(Object.fromEntries(keys.map(k => [k, toRef(obj, k)]))) as any
}
