import { unref } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import type { QueryBreakpoints } from '.'

export function matchBreakPoint(breakpoints: MaybeRef<QueryBreakpoints>, width: MaybeRef<number>) {
  const w = Math.round(unref(width))
  for (const [key, { min = 0, max }] of Object.entries(unref(breakpoints))) {
    if (w >= min && (max === undefined || w <= max))
      return key
  }
}
