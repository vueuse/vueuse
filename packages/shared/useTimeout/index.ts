import { tryOnUnmounted } from '@vueuse/shared'
import { ref } from 'vue-demi'

export function useTimeout(interval = 1000, immediate = true) {
  const ready = ref(false)

  let timer: ReturnType<typeof setTimeout> | null = null

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

  if (immediate)
    start()

  tryOnUnmounted(stop)

  return { ready, start, stop }
}
