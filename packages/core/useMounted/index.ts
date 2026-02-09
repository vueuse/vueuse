import type { ShallowRef } from 'vue'
import {
  getCurrentInstance,
  // eslint-disable-next-line no-restricted-imports
  onMounted,
  shallowRef,
} from 'vue'

/**
 * Mounted state in ref.
 *
 * @see https://vueuse.org/useMounted
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useMounted(): ShallowRef<boolean> & PromiseLike<boolean> {
  const isMounted = shallowRef(false)

  const instance = getCurrentInstance()
  if (instance) {
    const promise = new Promise<boolean>((resolve) => {
      onMounted(() => {
        isMounted.value = true
        resolve(true)
      }, instance)
    })

    Object.assign(isMounted, {
      then: promise.then.bind(promise),
    })
  }
  else {
    Object.assign(isMounted, {
      then: (onFulfilled: ((value: boolean) => any) | null | undefined) =>
        Promise.resolve(false).then(onFulfilled),
    })
  }

  return isMounted as ShallowRef<boolean> & PromiseLike<boolean>
}
