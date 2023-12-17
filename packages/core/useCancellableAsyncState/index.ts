import type { Fn } from '@vueuse/shared'
import { noop, promiseTimeout, until } from '@vueuse/shared'
import type { Ref, UnwrapRef } from 'vue-demi'
import { ref, shallowRef } from 'vue-demi'
import type { UseAsyncStateOptions, UseAsyncStateReturn, UseAsyncStateReturnBase } from '../useAsyncState'

/**
 * Handle overlapping executions.
 *
 * @param cancelCallback The provided callback is invoked when a re-invocation of the execute function is triggered before the previous one finished
 */
export type CancellableAsyncStateOnCancel = (cancelCallback: Fn) => void

/**
 * Cancellable version of `useAsyncState`.
 *
 * @see https://vueuse.org/useCancellableAsyncState
 * @param promise         The cancellable promise / async function to be resolved
 * @param initialState    The initial state, used until the first evaluation finishes
 * @param options
 */
export function useCancellableAsyncState<Data, Params extends any[] = [], Shallow extends boolean = true >(
  promise: Promise<Data> | ((onCancel: CancellableAsyncStateOnCancel, ...args: Params) => Promise<Data>),
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

  let counter = 0
  let cleanup: Fn | undefined
  const onCancel = (fn: Fn) => {
    cleanup = () => {
      fn()
      cleanup = void 0
    }
  }

  async function execute(delay = 0, ...args: any[]) {
    counter++
    if (cleanup)
      cleanup()

    const counterAtBeginning = counter
    let hasFinished = false

    if (resetOnExecute)
      state.value = initialState
    error.value = undefined
    isReady.value = false
    isLoading.value = true

    if (delay > 0)
      await promiseTimeout(delay)

    const _promise = typeof promise === 'function'
      ? promise(((cancelCallback) => {
        onCancel(() => {
          isLoading.value = false

          if (!hasFinished)
            cancelCallback()
        })
      }) as CancellableAsyncStateOnCancel, ...args as Params)
      : promise

    try {
      const data = await _promise
      if (counterAtBeginning === counter) {
        state.value = data
        isReady.value = true
        onSuccess(data)
      }
    }
    catch (e) {
      error.value = e
      onError(e)
      if (throwError)
        throw e
    }
    finally {
      if (counterAtBeginning === counter)
        isLoading.value = false

      hasFinished = true
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
