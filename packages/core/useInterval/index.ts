import { ref } from 'vue-demi'
import { maybeOnMounted, maybeOnUnmounted } from '../utils'

export function useInterval(interval = 1000, startRightNow = true) {
  let timer: any = null
  const counter = ref(0)

  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function start() {
    stop()
    timer = setInterval(() => {
      counter.value += 1
    }, interval)
  }

  if (startRightNow)
    maybeOnMounted(start)

  maybeOnUnmounted(stop)

  return { counter, start, stop }
}
