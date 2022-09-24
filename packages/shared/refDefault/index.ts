import type { Ref } from 'vue-demi'
import { computed } from 'vue-demi'

/**
 * Apply default value to a ref.
 *
 * @param source source ref
 * @param targets
 */
export function refDefault<T>(source: Ref<T | undefined | null>, defaultValue: T): Ref<T> {
  return computed({
    get() {
      return source.value ?? defaultValue
    },
    set(value) {
      source.value = value
    },
  })
}
