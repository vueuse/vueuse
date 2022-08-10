import type { Ref, WritableComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'

/**
 * Exposes a ref as a transformed value.
 *
 * @param sourceRef Raw ref
 * @param transformSource Transforms the sourceRef value to the exposed value.
 * @param transformTarget Transforms the exposed value to the sourceRef value.
 */
export function refTransformed<T, S>(
  sourceRef: Ref<S>,
  transformSource: (source: S) => T,
  transformTarget: (target: T) => S,
): WritableComputedRef<T> {
  return computed<T>({
    get() {
      return transformSource(sourceRef.value)
    },
    set(v: T) {
      sourceRef.value = transformTarget(v)
    },
  })
}

// alias
export {
  refTransformed as transformedRef,
}
