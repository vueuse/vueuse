import { noop } from '@vueuse/shared'
import { ref, shallowRef } from 'vue-demi'

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
  onError?: (e: Error) => void
}

/**
 * Reactive async state. Will not block your setup function and will triggers changes once
 * the promise is ready.
 *
 * @see   {@link https://vueuse.org/useAsyncState}
 * @param promise         The promise / async function to be resolved
 * @param initialState    The initial state, used until the first evaluation finishes
 * @param options
 */
export function useAsyncState<T>(
  promise: Promise<T> | (() => Promise<T>),
  initialState: T,
  options: AsyncStateOptions = {},
) {
  const {
    immediate = true,
    delay = 0,
    onError = noop,
  } = options

  const state = shallowRef(initialState)
  const isReady = ref(false)
  const error = ref<Error | undefined>(undefined)

  function _run() {
    const _promise = typeof promise === 'function'
      ? promise()
      : promise

    _promise
      .then((data) => {
        // @ts-ignore
        state.value = data
        isReady.value = true
      })
      .catch((e) => {
        error.value = e
        onError(e)
      })
  }

  function execute(delay = 0) {
    state.value = initialState
    error.value = undefined
    isReady.value = false
    if (!delay)
      _run()
    else
      setTimeout(_run, delay)
  }

  if (immediate)
    execute(delay)

  return {
    state,
    isReady,
    /** @deprecated, use isReady instead */
    ready: isReady,
    error,
    execute,
  }
}
