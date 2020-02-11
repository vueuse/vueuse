import { ref } from '../../api'
import { useTimeoutFn } from '../useTimeoutFn'

export function useAsyncState<T>(
  promise: Promise<T>,
  defaultState: T,
  delay = 0,
  catchFn = (e: Error) => {},
) {
  const state = ref(defaultState)
  const ready = ref(false)

  function run() {
    promise
      .then((data) => {
        // @ts-ignore
        state.value = data
        ready.value = true
      })
      .catch(catchFn)
  }

  if (!delay)
    run()
  else
    useTimeoutFn(run, delay)

  return { state, ready }
}
