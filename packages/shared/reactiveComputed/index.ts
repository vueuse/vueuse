import type { UnwrapNestedRefs } from 'vue-demi'
import { computed } from 'vue-demi'
import { toReactive } from '../toReactive'

/**
 * Computed reactive object.
 */
export function reactiveComputed<T extends object>(fn: () => T): UnwrapNestedRefs<T> {
  return toReactive(computed(fn))
}
