import type { MaybeRefOrGetter, Ref } from 'vue'
import type { Fn } from '../utils'
import { customRef, toValue } from 'vue'

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
  let value: T = toValue(defaultValue)
  let trigger: Fn

  const reset = () => {
    value = toValue(defaultValue)
    trigger()
  }

  const refValue = customRef<T>((track, _trigger) => {
    trigger = _trigger
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        value = newValue
        trigger()
      },
    }
  }) as ManualResetRefReturn<T>

  refValue.reset = reset

  return refValue
}
