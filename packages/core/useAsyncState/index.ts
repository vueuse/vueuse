import { Ref, ref } from 'vue-demi'

/**
 * Reactive async state. Will not block your setup function and will triggers changes once
 * the promise is ready.
 *
 * @see   {@link https://vueuse.org/useAsyncState}
 * @param promise         The promise / async function to be resolved
 * @param initialState    The initial state, used until the first evaluation finishes
 * @param delay           Delay (ms)
 * @param catchFn         Error handling callback
 */
export function useAsyncState<T>(
  promise: Promise<T> | (() => Promise<T>),
  initialState: T,
  delay = 0,
  catchFn = (e: Error) => {},
) {
  const state = ref(initialState) as Ref<T>
  const ready = ref(false)
  const error = ref<Error | undefined>(undefined)

  function _run() {
    const _promise = typeof promise === 'function'
      ? promise()
      : promise

    _promise
      .then((data) => {
        // @ts-ignore
        state.value = data
        ready.value = true
      })
      .catch((e) => {
        error.value = e
        catchFn(e)
      })
  }

  function rerun(delay = 0) {
    state.value = initialState
    error.value = undefined
    ready.value = false
    if (!delay)
      _run()
    else
      setTimeout(_run, delay)
  }

  rerun(delay)

  return { state, ready, error, rerun }
}
