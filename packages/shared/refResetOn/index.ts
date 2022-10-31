import type { CustomRefFactory, Ref } from 'vue-demi'
import { customRef } from 'vue-demi'
import { tryOnScopeDispose } from '../tryOnScopeDispose'
import type { EventHook } from '../createEventHook'

/**
 * Create a ref which will be reset when eventHook is triggered.
 *
 * @see https://vueuse.org/refResetOn
 * @param defaultValue The value which will be set.
 * @param on EventHook's register
 */
export function refResetOn<T>(defaultValue: () => T, on: EventHook['on']): Ref<T>
export function refResetOn<T>(defaultValue: T, on: EventHook['on']): Ref<T>
export function refResetOn<T>(defaultValue: unknown, on: EventHook['on']): Ref<T> {
  return customRef<T>((track, trigger) => {
    let value: T = typeof defaultValue === 'function' ? defaultValue() : defaultValue

    const valRef: ReturnType<CustomRefFactory<T>> = {
      get() {
        track()
        return value
      },
      set(newValue) {
        value = newValue
        trigger()
      },
    }

    const hook = on(() => {
      valRef.set(typeof defaultValue === 'function' ? defaultValue() : defaultValue)
    })

    tryOnScopeDispose(hook.off)

    return valRef
  })
}
