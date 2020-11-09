import { watch } from 'vue-demi'
import { useTimeout } from '../useTimeout'

export function useTimeoutFn(
  cb: () => any,
  interval?: number,
  startRightNow?: boolean,
) {
  const { ready, start, stop } = useTimeout(interval, startRightNow)

  watch(
    ready,
    (maturity) => {
      maturity && cb()
    },
  )

  return { ready, start, stop }
}
