import { readonly, ref } from 'vue-demi'
import type { FunctionArgs } from '..'

/**
 * A boolean ref with a async function.
 *
 * @see https://vueuse.org/useLoadingFn
 */
export function useLoadingFn<Args extends any[], T extends FunctionArgs<Args, Promise<any>>>(fn: T) {
  const boolean = ref(false)
  const newFn = (...args: Args) => {
    return new Promise((resolve, reject) => {
      boolean.value = true
      fn(...args)
        .then(resolve)
        .catch(reject)
        .finally(() => {
          boolean.value = false
        })
    })
  }
  return [readonly(boolean), newFn as any as T] as const
}
