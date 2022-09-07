import { computed, ref } from 'vue-demi'

import type { ComputedRef, Ref } from 'vue-demi'

export interface UseAsyncFunctionOptions {
  several: boolean
}

interface UseAsyncFunctionBase {
  trigger: () => Promise<void>
  isLoading: ComputedRef<boolean>
  calls: Ref<number>
  loadingCalls: Ref<number>
}

export interface UseAsyncFunctionSeveral<D> extends UseAsyncFunctionBase {
  result: Ref<D[]>
}

export interface UseAsyncFunctionSingle<D> extends UseAsyncFunctionBase {
  result: Ref<D | undefined>
}

export function useAsyncFunction<R = unknown, T = unknown>(
  fn: (...args: T[]) => Promise<R>, options: UseAsyncFunctionOptions & { several: true }
): UseAsyncFunctionSeveral<R>
export function useAsyncFunction<R = unknown, T = unknown>(
  fn: (...args: T[]) => Promise<R>, options: UseAsyncFunctionOptions & { several: false }
): UseAsyncFunctionSingle<R>
export function useAsyncFunction<R = unknown, T = unknown>(
  fn: (...args: T[]) => Promise<R>
): UseAsyncFunctionSingle<R>
export function useAsyncFunction<R = unknown, T = unknown>(
  fn: (...args: T[]) => Promise<R>, options?: UseAsyncFunctionOptions,
): UseAsyncFunctionSingle<R> | UseAsyncFunctionSeveral<R> {
  const status = ref(false)

  const result = ref<R | R[] | undefined>(options?.several ? [] : undefined)

  const calls = ref(0)

  const loadingCalls = ref(0)

  async function trigger() {
    if (!options?.several && status.value)
      return

    status.value = true
    loadingCalls.value += 1

    const res = await fn()

    if (options?.several)
      (result as Ref<R[]>).value.push(res)
    else
      (result as Ref<R>).value = res

    loadingCalls.value -= 1
    calls.value += 1

    if (!loadingCalls.value)
      status.value = false
  }

  return { trigger, isLoading: computed(() => status.value), result: (result as any), calls, loadingCalls }
}
