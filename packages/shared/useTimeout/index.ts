import { tryOnUnmounted } from '@vueuse/shared'
import { ref } from 'vue-demi'

export function useTimeout(interval = 1000, startRightNow = true) {
  const ready = ref(false)

  let timer: any = null

  function stop() {
    ready.value = false
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function start() {
    stop()
    timer = setTimeout(() => {
      ready.value = true
      timer = null
    }, interval)
  }

  if (startRightNow)
    start()

  tryOnUnmounted(stop)

  return { ready, start, stop }
}
