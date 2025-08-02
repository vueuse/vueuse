import type { ComputedGetter, UnwrapNestedRefs } from 'vue'
import { computed } from 'vue'
import { toReactive } from '../toReactive'

export type ReactiveComputedReturn<T extends object> = UnwrapNestedRefs<T>

/**
 * Computed reactive object.
 */
export function reactiveComputed<T extends object>(fn: ComputedGetter<T>): ReactiveComputedReturn<T> {
  return toReactive<T>(computed<T>(fn))
}
