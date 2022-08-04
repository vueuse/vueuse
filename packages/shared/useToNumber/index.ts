import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import { resolveUnref } from '../resolveUnref'
import type { MaybeComputedRef } from '../utils'

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
 * Computed reactive object.
 */
export function useToNumber(
  value: MaybeComputedRef<number | string>,
  options: UseToNumberOptions = {},
): ComputedRef<number> {
  const {
    method = 'parseFloat',
    radix,
    nanToZero,
  } = options

  return computed(() => {
    let resolved = resolveUnref(value)
    if (typeof resolved === 'string')
      resolved = Number[method](resolved, radix)
    if (nanToZero && isNaN(resolved))
      resolved = 0
    return resolved
  })
}
