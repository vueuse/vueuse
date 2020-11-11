import { watch } from 'vue-demi'
import { useTimeout } from '../useTimeout'

export function useTimeoutFn(
  cb: () => any,
  interval?: number,
  immediate?: boolean,
) {
  const { ready, start, stop } = useTimeout(interval, immediate)

  watch(
    ready,
    (maturity) => {
      maturity && cb()
    },
  )

  return { ready, start, stop }
}
