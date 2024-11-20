import type { UnwrapNestedRefs } from 'vue'
import { computed } from 'vue'
import { toReactive } from '../toReactive'

/**
 * Computed reactive object.
 */
export function reactiveComputed<T extends object>(fn: () => T): UnwrapNestedRefs<T> {
  return toReactive(computed(fn))
}
