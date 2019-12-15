import { ref, onUnmounted, getCurrentInstance } from '@vue/composition-api'

export function useTimeout (ms = 1000) {
  const ready = ref(false)

  let timer: any = null

  function clear () {
    ready.value = false
    clearTimeout(timer)
    timer = null
  }

  function start () {
    clear()
    timer = setTimeout(() => {
      ready.value = true
    }, ms)
  }

  start()

  if (getCurrentInstance())
    onUnmounted(clear)

  return [
    ready,
    clear,
    start,
  ] as const
}
