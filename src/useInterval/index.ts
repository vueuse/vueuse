import { onMounted } from '@vue/composition-api'
import { onUnmounted, getCurrentInstance, ref } from '../api'

export function useInterval (interval = 1000, startRightNow = true) {
  let timer: any = null
  const counter = ref(0)

  function stop () {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function start () {
    stop()
    timer = setInterval(() => {
      counter.value += 1
    }, interval)
  }

  if (startRightNow)
    onMounted(start)

  if (getCurrentInstance())
    onUnmounted(stop)

  return { counter, start, stop }
}
