import { watch, Ref } from '../api'
import { useTimeout } from '..'

export function useTimeoutFn (
  cb: () => any,
  ms?: number,
): [() => any, () => any, Ref<boolean>] {
  const [ready, clear, runAgain] = useTimeout(ms)

  watch(
    ready,
    (maturity) => {
      maturity && cb()
    },
    { lazy: true },
  )

  return [clear, runAgain, ready]
}
