import { watch } from '../api'
import { useTimeout } from '../useTimeout'

export function useTimeoutFn (
  cb: () => any,
  interval?: number,
) {
  const { ready, start, stop } = useTimeout(interval)

  watch(
    ready,
    (maturity) => {
      maturity && cb()
    },
    { lazy: true },
  )

  return { ready, start, stop }
}
