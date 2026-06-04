import type { MaybeRef, Ref, ShallowRef, UnwrapRef } from 'vue'
import { noop, promiseTimeout, until } from '@vueuse/shared'
import { customRef, ref as deepRef, shallowRef, toValue } from 'vue'

export interface UseAsyncStateReturnBase<Data, Params extends any[], Shallow extends boolean> {
  state: Shallow extends true ? Ref<Data> : Ref<UnwrapRef<Data>>
  isReady: Ref<boolean>
  isLoading: Ref<boolean>
  error: Ref<unknown>
  execute: (delay?: number, ...args: Params) => Promise<Data | undefined>
  executeImmediate: (...args: Params) => Promise<Data | undefined>
}

export type UseAsyncStateReturn<Data, Params extends any[], Shallow extends boolean>
  = UseAsyncStateReturnBase<Data, Params, Shallow>
    & PromiseLike<UseAsyncStateReturnBase<Data, Params, Shallow>>

export interface UseAsyncStateOptions<Shallow extends boolean, D = any> {
  /**
   * Delay for the first execution of the promise when "immediate" is true. In milliseconds.
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
export function useAsyncState<Data, Params extends any[] = any[], Shallow extends boolean = true>(
  promise: Promise<Data> | ((...args: Params) => Promise<Data>),
  initialState: MaybeRef<Data>,
  options?: UseAsyncStateOptions<Shallow, Data>,
): UseAsyncStateReturn<Data, Params, Shallow> {
  const {
    immediate = true,
    delay = 0,
    onError = globalThis.reportError ?? noop,
    onSuccess = noop,
    resetOnExecute = true,
    shallow = true,
    throwError,
  } = options ?? {}
  const isReady = shallowRef(false)
  const isLoading = shallowRef(false)
  const error = shallowRef<unknown | undefined>(undefined)

  let executionsCount = 0

  // Setting state.value externally (outside of execute()) cancels any in-flight
  // execution so the promise result cannot overwrite the caller's value.
  // We track this with an _internalWrite flag: execute() sets it before writing
  // state, so the customRef setter knows not to bump executionsCount.
  let _internalWrite = false
  // _source holds the raw value; for deep reactivity we pre-wrap it so that
  // nested objects are still made reactive when shallow === false.
  let _source: Data = shallow
    ? toValue(initialState)
    : deepRef(toValue(initialState)).value as Data

  const state = customRef<Data>((track, trigger) => {
    return {
      get() {
        track()
        return _source
      },
      set(value: Data) {
        _source = shallow ? value : deepRef(value).value as Data
        if (!_internalWrite) {
          executionsCount += 1
          // Clear loading/ready state immediately so the caller gets a consistent
          // snapshot when setting state directly.
          isLoading.value = false
          isReady.value = false
        }
        trigger()
      },
    }
  }) as Shallow extends true ? ShallowRef<Data> : Ref<UnwrapRef<Data>>
  async function execute(delay = 0, ...args: any[]) {
    const executionId = (executionsCount += 1)

    if (resetOnExecute) {
      _internalWrite = true
      state.value = toValue(initialState) as any
      _internalWrite = false
    }
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
      if (executionId === executionsCount) {
        _internalWrite = true
        state.value = data as any
        _internalWrite = false
        isReady.value = true
      }
      onSuccess(data)
      return data
    }
    catch (e) {
      if (executionId === executionsCount)
        error.value = e
      onError(e)
      if (throwError)
        throw e
    }
    finally {
      if (executionId === executionsCount)
        isLoading.value = false
    }
  }

  if (immediate) {
    execute(delay)
  }

  const shell: UseAsyncStateReturnBase<Data, Params, Shallow> = {
    state,
    isReady,
    isLoading,
    error,
    execute,
    executeImmediate: (...args: any[]) => execute(0, ...args),
  }

  function waitUntilIsLoaded() {
    return new Promise<UseAsyncStateReturnBase<Data, Params, Shallow>>((resolve, reject) => {
      until(isLoading).toBe(false).then(() => resolve(shell)).catch(reject)
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
