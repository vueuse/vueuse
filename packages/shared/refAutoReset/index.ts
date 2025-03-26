import type { MaybeRefOrGetter, Ref } from 'vue'
import { customRef, toValue } from 'vue'
import { tryOnScopeDispose } from '../tryOnScopeDispose'

/**
 * Create a ref which will be reset to the default value after some time.
 *
 * @see https://vueuse.org/refAutoReset
 * @param defaultValue The value which will be set.
 * @param afterMs      A zero-or-greater delay in milliseconds.
 */
export function refAutoReset<T>(defaultValue: MaybeRefOrGetter<T>, afterMs: MaybeRefOrGetter<number> = 10000): Ref<T> {
  return customRef<T>((track, trigger) => {
    let value: T = toValue(defaultValue)
    let timer: any

    const resetAfter = () =>
      setTimeout(() => {
        value = toValue(defaultValue)
        trigger()
      }, toValue(afterMs))

    tryOnScopeDispose(() => {
      clearTimeout(timer)
    })

    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        value = newValue
        trigger()

        clearTimeout(timer)
        timer = resetAfter()
      },
    }
  })
}

// alias
export { refAutoReset as autoResetRef }
