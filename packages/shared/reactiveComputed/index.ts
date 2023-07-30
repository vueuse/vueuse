import { computed } from 'vue-demi'
import { toReactive } from '../toReactive'

/**
 * Computed reactive object.
 */
export function reactiveComputed<T extends object>(fn: () => T): T {
  return toReactive(computed(fn))
}
