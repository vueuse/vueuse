import { tryOnUnmounted } from '@vueuse/shared'
import { ref } from 'vue-demi'

export function useIntervalFn(cb: Function, interval = 1000, immediate = true) {
  let timer: any = null
  const activated = ref(false)

  function clean() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function stop() {
    activated.value = false
    clean()
  }

  function start() {
    activated.value = true
    clean()
    timer = setInterval(cb, interval)
  }

  if (immediate)
    start()

  tryOnUnmounted(stop)

  return { activated, start, stop }
}
