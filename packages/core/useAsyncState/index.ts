import { noop, promiseTimeout } from '@vueuse/shared'
import { Ref, ref, shallowRef } from 'vue-demi'

export interface UseAsyncStateReturn<T> {
  state: Ref<T>
  isReady: Ref<boolean>
  error: Ref<unknown>
  execute: (delay?: number, ...args: any[]) => Promise<T>
}

export interface AsyncStateOptions {
  /**
   * Delay for executing the promise. In milliseconds.
   *
   * @default 0
   */
  delay?: number

  /**
   * Excute the promise right after the function is invoked.
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
  shallow?: boolean
}

/**
 * Reactive async state. Will not block your setup function and will triggers changes once
 * the promise is ready.
 *
 * @see https://vueuse.org/useAsyncState
 * @param promise         The promise / async function to be resolved
 * @param initialState    The initial state, used until the first evaluation finishes
 * @param options
 */
export function useAsyncState<T>(
  promise: Promise<T> | ((...args: any[]) => Promise<T>),
  initialState: T,
  options: AsyncStateOptions = {},
): UseAsyncStateReturn<T> {
  const {
    immediate = true,
    delay = 0,
    onError = noop,
    resetOnExecute = true,
    shallow = true,
  } = options

  const state = shallow ? shallowRef(initialState) : ref(initialState) as Ref<T>
  const isReady = ref(false)
  const error = ref<unknown | undefined>(undefined)

  async function execute(delay = 0, ...args: any[]) {
    if (resetOnExecute)
      state.value = initialState
    error.value = undefined
    isReady.value = false

    if (delay > 0)
      await promiseTimeout(delay)

    const _promise = typeof promise === 'function'
      ? promise(...args)
      : promise

    try {
      const data = await _promise
      // @ts-ignore
      state.value = data
      isReady.value = true
    }
    catch (e) {
      error.value = e
      onError(e)
    }

    return state.value
  }

  if (immediate)
    execute(delay)

  return {
    state,
    isReady,
    error,
    execute,
  }
}
