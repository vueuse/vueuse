import { noop, promiseTimeout } from '@vueuse/shared'
import type { Ref, UnwrapRef } from 'vue-demi'
import { ref, shallowRef } from 'vue-demi'

export interface UseAsyncStateReturn<Data, Shallow extends boolean, Args extends unknown[]> {
  state: Shallow extends true ? Ref<Data> : Ref<UnwrapRef<Data>>
  isReady: Ref<boolean>
  isLoading: Ref<boolean>
  error: Ref<unknown>
  execute: (delay?: number, ...args: Args) => Promise<Data>
}

export interface UseAsyncStateOptions<Shallow extends boolean, Args extends unknown[]> {
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
   * Use {@link immediateArgs} to provide initial arguments.
   *
   * @default true
   */
  immediate?: boolean

  /**
   * Arguments that are passed when the promise is executed immediately.
   * Only relevant for the immediate execution, when {@link immediate} is not set to `false`.
   *
   * @default []
   */
  immediateArgs?: Args

  /**
   * Callback when error is caught.
   */
  onError?: (e: unknown) => void

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
export function useAsyncState<Data, Args extends unknown[], Shallow extends boolean = true>(
  promise: Promise<Data> | ((...args: Args) => Promise<Data>),
  initialState: Data,
  options?: UseAsyncStateOptions<Shallow, Args>,
): UseAsyncStateReturn<Data, Shallow, Args> {
  const {
    immediate = true,
    immediateArgs = [],
    delay = 0,
    onError = noop,
    resetOnExecute = true,
    shallow = true,
    throwError,
  } = options ?? {}

  const state = shallow ? shallowRef(initialState) : ref(initialState)
  const isReady = ref(false)
  const isLoading = ref(false)
  const error = ref<unknown | undefined>(undefined)

  async function execute(delay = 0, ...args: Args) {
    if (resetOnExecute)
      state.value = initialState
    error.value = undefined
    isReady.value = false
    isLoading.value = true

    if (delay > 0)
      await promiseTimeout(delay)

    const _promise = typeof promise === 'function'
      ? promise(...args)
      : promise

    try {
      const data = await _promise
      state.value = data
      isReady.value = true
    }
    catch (e) {
      error.value = e
      onError(e)
      if (throwError)
        throw error
    }
    finally {
      isLoading.value = false
    }

    return state.value as Data
  }

  if (immediate)
    execute(delay, ...(immediateArgs as Args))

  return {
    state: state as Shallow extends true ? Ref<Data> : Ref<UnwrapRef<Data>>,
    isReady,
    isLoading,
    error,
    execute,
  }
}
