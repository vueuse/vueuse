import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

export interface UseToNumberOptions {
  /**
   * Method to use to convert the value to a number.
   *
   * Or a custom function for the conversion.
   *
   * @default 'parseFloat'
   */
  method?: 'parseFloat' | 'parseInt' | ((value: string | number) => number)

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
    if (typeof method === 'function')
      resolved = method(resolved)
    else if (typeof resolved === 'string')
      resolved = Number[method](resolved, radix)

    if (nanToZero && Number.isNaN(resolved))
      resolved = 0
    return resolved
  })
}
