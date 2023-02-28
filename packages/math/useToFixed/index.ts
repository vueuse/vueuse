import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

export interface FixedTypes {
  type?: 'string' | 'number'
  math?: 'floor' | 'ceil' | 'round'
}

/**
 * @deprecated use `usePrecision` instead
 */
export function useToFixed(
  value: MaybeComputedRef<number | string>,
  digits: MaybeComputedRef<number>,
  options?: MaybeComputedRef<FixedTypes>,
): ComputedRef<number | string> {
  return computed<number | string>(() => {
    const floatValue = parseFloat(`${resolveUnref(value)}`)
    const outValue = Math[resolveUnref(options)?.math || 'round'](floatValue * 10 ** resolveUnref(digits)) / 10 ** resolveUnref(digits)
    return resolveUnref(options)?.type === 'string'
      ? resolveUnref(digits) >= 0
        ? outValue.toFixed(resolveUnref(digits))
        : `${outValue}`
      : outValue
  })
}
