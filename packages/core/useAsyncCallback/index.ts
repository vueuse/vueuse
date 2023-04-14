import { makeDestructurable } from '@vueuse/shared'
import type { AnyPromiseFn } from '@vueuse/shared'

import { ref } from 'vue-demi'
import type { Ref } from 'vue-demi'

export type UseAsyncCallbackReturn<Fn extends AnyPromiseFn> =
  readonly [Fn, Ref<boolean>, Ref<any>] &
  { execute: Fn; loading: Ref<boolean>; error: Ref<any> }

/**
 * Using async functions
 *
 * @see https://vueuse.org/useAsyncCallback
 * @param target
 * @param keyframes
 * @param options
 */
export function useAsyncCallback<T extends AnyPromiseFn>(fn: T): UseAsyncCallbackReturn<T> {
  const error = ref()
  const loading = ref(false)

  const execute = (async (...args: any[]) => {
    try {
      loading.value = true
      const result = await fn(...args)
      loading.value = false
      return result
    }
    catch (err) {
      loading.value = false
      error.value = err
      throw err
    }
  }) as T

  return makeDestructurable(
    { execute, loading, error } as const,
    [execute, loading, error] as const,
  )
}
