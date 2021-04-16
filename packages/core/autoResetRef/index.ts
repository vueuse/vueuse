import { customRef, Ref, unref } from 'vue-demi'
import { MaybeRef } from '@vueuse/shared'

/**
 * Create a ref which will be reset to the default value after some time.
 *
 * @link https://vueuse.org/autoResetRef
 * @param defaultValue The value which will be set.
 * @param afterMs      A zero-or-greater delay in milliseconds.
 */
export function autoResetRef<T>(defaultValue: T, afterMs: MaybeRef<number> = 10000): Ref<T> {
  return customRef<T>((track, trigger) => {
    let value: T = defaultValue
    let timer: any

    const resetAfter = () =>
      setTimeout(() => {
        value = defaultValue
        trigger()
      }, unref(afterMs))

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
