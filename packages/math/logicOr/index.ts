import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import { resolveUnref } from '@vueuse/shared'
import type { MaybeComputedRef } from '@vueuse/shared'

/**
 * `OR` conditions for refs.
 *
 * @see https://vueuse.org/logicOr
 */
export function logicOr(...args: MaybeComputedRef<any>[]): ComputedRef<boolean> {
  return computed(() => args.some(i => resolveUnref(i)))
}

// alias
export { logicOr as or }
