import { computed } from 'vue-demi'
import { toReactive } from '../toReactive'

/**
 * Computed reactive object.
 */
export function reactiveComputed<T extends {}>(fn: () => T): Readonly<T> {
  return toReactive(computed(() => fn()))
}
