import { onUnmounted, getCurrentInstance } from '../api'

export function useIntervalFn (cb: Function, interval = 1000, startRightNow = true) {
  let timer: any = null

  function stop () {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function start () {
    stop()
    timer = setInterval(cb, interval)
  }

  if (startRightNow)
    start()

  if (getCurrentInstance())
    onUnmounted(stop)

  return { start, stop }
}
