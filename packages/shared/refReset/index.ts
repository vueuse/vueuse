import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import type { MaybeRefOrGetter } from '../utils'
import { toValue } from '../toValue'

/**
 * Create a ref which can be reset to the default value.
 *
 * @see https://vueuse.org/refReset
 * @param defaultValue The value which will be set.
 */
export function refReset<T>(defaultValue: MaybeRefOrGetter<T>) {
  const _ref = ref(toValue(defaultValue)) as Ref<T> & { reset: () => void }

  _ref.reset = () => {
    _ref.value = toValue(defaultValue)
  }

  return _ref
}

// alias
export { refReset as resetRef }
