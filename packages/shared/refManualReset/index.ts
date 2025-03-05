import type { MaybeRefOrGetter, Ref } from 'vue'
import type { Fn } from '../utils'
import { ref as deepRef, toValue } from 'vue'

/**
 * Define the shape of a ref that supports manual reset functionality.
 *
 * This interface extends the standard `Ref` type from Vue and adds a `reset` method.
 * The `reset` method allows the ref to be manually reset to its default value.
 */
export interface ManualResetRefReturn<T> extends Ref<T> {
  reset: Fn
}

/**
 * Create a ref with manual reset functionality.
 *
 * @see https://vueuse.org/refManualReset
 * @param defaultValue The value which will be set.
 */
export function refManualReset<T>(defaultValue: MaybeRefOrGetter<T>) {
  const value: T = toValue(defaultValue)
  const ret = deepRef(value) as unknown as ManualResetRefReturn<T>
  ret.reset = () => {
    ret.value = value
  }
  return ret
}

// alias
export { refManualReset as manualResetRef }
