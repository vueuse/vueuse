import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'

export interface UseAsyncFunctionOptions {
  several: boolean
}

interface UseAsyncFunctionBase {
  trigger: () => Promise<void>
  isLoading: Ref<boolean>
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
  const isLoading = ref(false)

  const result = ref<R | R[] | undefined>(options?.several ? [] : undefined)

  const calls = ref(0)

  const loadingCalls = ref(0)

  async function trigger() {
    if (!options?.several && isLoading.value)
      return

    isLoading.value = true
    loadingCalls.value += 1

    const res = await fn()

    if (options?.several)
      (result as Ref<R[]>).value.push(res)
    else
      (result as Ref<R>).value = res

    loadingCalls.value -= 1
    calls.value += 1

    if (!loadingCalls.value)
      isLoading.value = false
  }

  return { trigger, isLoading, result: (result as any), calls, loadingCalls }
}
