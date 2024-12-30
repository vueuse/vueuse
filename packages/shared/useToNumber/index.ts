import type { ComputedRef } from 'vue'
import type { MaybeRefOrGetter } from '../utils'
import { computed, toValue } from 'vue'

export interface UseToNumberOptions {
  /**
   * Method to use to convert the value to a number.
   *
   * @default 'parseFloat'
   */
  method?: 'parseFloat' | 'parseInt'

  /**
   * The base in mathematical numeral systems passed to `parseInt`.
   * Only works with `method: 'parseInt'`
   */
  radix?: number

  /**
   * Replace NaN with zero
   *
   * @default false
   */
  nanToZero?: boolean
}

/**
 * Reactively convert a string ref to number.
 */
export function useToNumber(
  value: MaybeRefOrGetter<number | string>,
  options: UseToNumberOptions = {},
): ComputedRef<number> {
  const {
    method = 'parseFloat',
    radix,
    nanToZero,
  } = options

  return computed(() => {
    let resolved = toValue(value)
    if (typeof resolved === 'string')
      resolved = Number[method](resolved, radix)

    if (!Number.isNaN(resolved) && !Number.isSafeInteger(resolved))
      console.warn(`useToNumber: ${value} not a safe integer, resolved value may not be accurate`)

    if (nanToZero && Number.isNaN(resolved))
      resolved = 0
    return resolved
  })
}
