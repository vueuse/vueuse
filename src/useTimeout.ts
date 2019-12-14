import { ref, onUnmounted, getCurrentInstance } from '@vue/composition-api'

export function useTimeout (ms = 1000) {
  const currentInstance = getCurrentInstance()
  const ready = ref(false)

  let timer: any = null

  function clear () {
    ready.value = false
    clearTimeout(timer)
    timer = null
  }

  function setTimer () {
    clear()
    timer = setTimeout(() => {
      ready.value = true
    }, ms)
  }

  setTimer()

  if (currentInstance)
    onUnmounted(clear)

  return {
    ready,
    runTimerAgain: setTimer(),
  }
}
