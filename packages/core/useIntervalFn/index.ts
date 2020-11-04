import { tryOnMounted } from '@vueuse/shared'

export function useIntervalFn(cb: Function, interval = 1000, startRightNow = true) {
  let timer: any = null

  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function start() {
    stop()
    timer = setInterval(cb, interval)
  }

  if (startRightNow)
    start()

  tryOnMounted(stop)

  return { start, stop }
}
