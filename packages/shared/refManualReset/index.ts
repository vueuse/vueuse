import type { MaybeRefOrGetter, Ref } from 'vue'
import type { Fn } from '../utils'
import { cloneFnJSON, isObject } from '@vueuse/core'
import { customRef, reactive, toValue } from 'vue'

/**
 * Converts a given value to a reactive object
 *
 * @param value - The value to be converted, can be of any type
 * @returns If the input value is an object, returns its reactive proxy; otherwise returns the original value
 */
export function toReactive<T>(value: T): T {
  return isObject(value) ? reactive(value as any) : value
}

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
 * @param shallow - Whether to use shallow ref.
 */
export function refManualReset<T>(defaultValue: MaybeRefOrGetter<T>, shallow = false) {
  const createValue = () => {
    let value: T = toValue(cloneFnJSON(defaultValue))
    if (!shallow) {
      value = toReactive(value)
    }
    return value
  }

  let value = createValue()
  let trigger: Fn

  const reset = () => {
    value = createValue()
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
        value = shallow ? newValue : toReactive(newValue)
        trigger()
      },
    }
  }) as ManualResetRefReturn<T>

  refValue.reset = reset

  return refValue
}
