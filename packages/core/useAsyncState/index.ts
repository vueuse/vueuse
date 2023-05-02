import { noop, promiseTimeout, until } from '@vueuse/shared'
import type { Ref, UnwrapRef } from 'vue-demi'
import { ref, shallowRef } from 'vue-demi'

export interface UseAsyncStateReturnBase<Data, Params extends any[], Shallow extends boolean> {
  state: Shallow extends true ? Ref<Data> : Ref<UnwrapRef<Data>>
  isReady: Ref<boolean>
  isLoading: Ref<boolean>
  error: Ref<unknown>
  execute: (delay?: number, ...args: Params) => Promise<Data>
}

export type UseAsyncStateReturn<Data, Params extends any[], Shallow extends boolean> =
  UseAsyncStateReturnBase<Data, Params, Shallow>
  & PromiseLike<UseAsyncStateReturnBase<Data, Params, Shallow>>

export interface UseAsyncStateOptions<Shallow extends boolean, D = any> {
  /**
   * Delay for executing the promise. In milliseconds.
   *
   * @default 0
   */
  delay?: number

  /**
   * Execute the promise right after the function is invoked.
   * Will apply the delay if any.
   *
   * When set to false, you will need to execute it manually.
   *
   * @default true
   */
  immediate?: boolean

  /**
   * Callback when error is caught.
   */
  onError?: (e: unknown) => void

  /**
   * Callback when success is caught.
   * @param {D} data
   */
  onSuccess?: (data: D) => void

  /**
   * Sets the state to initialState before executing the promise.
   *
   * This can be useful when calling the execute function more than once (for
   * example, to refresh data). When set to false, the current state remains
   * unchanged until the promise resolves.
   *
   * @default true
   */
  resetOnExecute?: boolean

  /**
   * Use shallowRef.
   *
   * @default true
   */
  shallow?: Shallow
  /**
   *
   * An error is thrown when executing the execute function
   *
   * @default false
   */
  throwError?: boolean
}

/**
 * Reactive async state. Will not block your setup function and will trigger changes once
 * the promise is ready.
 *
 * @see https://vueuse.org/useAsyncState
 * @param promise         The promise / async function to be resolved
 * @param initialState    The initial state, used until the first evaluation finishes
 * @param options
 */
export function useAsyncState<Data, Params extends any[] = [], Shallow extends boolean = true>(
  promise: Promise<Data> | ((...args: Params) => Promise<Data>),
  initialState: Data,
  options?: UseAsyncStateOptions<Shallow, Data>,
): UseAsyncStateReturn<Data, Params, Shallow> {
  const {
    immediate = true,
    delay = 0,
    onError = noop,
    onSuccess = noop,
    resetOnExecute = true,
    shallow = true,
    throwError,
  } = options ?? {}
  const state = shallow ? shallowRef(initialState) : ref(initialState)
  const isReady = ref(false)
  const isLoading = ref(false)
  const error = shallowRef<unknown | undefined>(undefined)

  async function execute(delay = 0, ...args: any[]) {
    if (resetOnExecute)
      state.value = initialState
    error.value = undefined
    isReady.value = false
    isLoading.value = true

    if (delay > 0)
      await promiseTimeout(delay)

    const _promise = typeof promise === 'function'
      ? promise(...args as Params)
      : promise

    try {
      const data = await _promise
      state.value = data
      isReady.value = true
      onSuccess(data)
    }
    catch (e) {
      error.value = e
      onError(e)
      if (throwError)
        throw e
    }
    finally {
      isLoading.value = false
    }

    return state.value as Data
  }

  if (immediate)
    execute(delay)

  const shell: UseAsyncStateReturnBase<Data, Params, Shallow> = {
    state: state as Shallow extends true ? Ref<Data> : Ref<UnwrapRef<Data>>,
    isReady,
    isLoading,
    error,
    execute,
  }

  function waitUntilIsLoaded() {
    return new Promise<UseAsyncStateReturnBase<Data, Params, Shallow>>((resolve, reject) => {
      until(isLoading).toBe(false)
        .then(() => resolve(shell))
        .catch(reject)
    })
  }

  return {
    ...shell,
    then(onFulfilled, onRejected) {
      return waitUntilIsLoaded()
        .then(onFulfilled, onRejected)
    },
  }
}
