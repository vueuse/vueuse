import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Reactively Math
 *
 * @see https://vueuse.org/useMath
 * @param methodName
 * @param {...any[]} args
 */

export function useMath(
  methodName: keyof Math,
  ...args: MaybeComputedRef<number>[]): ComputedRef<number> {
  if (Math[methodName] === undefined)
    throw new Error(`Math.${methodName.toString()} does not exist`)
  return computed<number>(() => {
    const value = Math[methodName]
    if (typeof value === 'function')
      return (value as Function)(...args.map(value => resolveUnref(value)))
    else
      return value
  })
}
