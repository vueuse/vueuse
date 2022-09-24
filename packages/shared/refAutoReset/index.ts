import type { Ref } from 'vue-demi'
import { customRef } from 'vue-demi'
import type { MaybeComputedRef } from '../utils'
import { resolveUnref } from '../resolveUnref'
import { tryOnScopeDispose } from '../tryOnScopeDispose'

/**
 * Create a ref which will be reset to the default value after some time.
 *
 * @see https://vueuse.org/refAutoReset
 * @param defaultValue The value which will be set.
 * @param afterMs      A zero-or-greater delay in milliseconds.
 */
export function refAutoReset<T>(defaultValue: T, afterMs: MaybeComputedRef<number> = 10000): Ref<T> {
  return customRef<T>((track, trigger) => {
    let value: T = defaultValue
    let timer: any

    const resetAfter = () =>
      setTimeout(() => {
        value = defaultValue
        trigger()
      }, resolveUnref(afterMs))

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
