import { ref } from 'vue-demi'
import { tryOnUnmounted } from '@vueuse/shared'

export function useInterval(interval = 1000, immediate = true) {
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

  if (immediate)
    start()

  tryOnUnmounted(stop)

  return { counter, start, stop }
}
