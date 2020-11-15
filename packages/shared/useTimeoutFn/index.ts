import { ref } from 'vue-demi'
import { tryOnUnmounted } from '../tryOnUnmounted'

/**
 * Wrapper for `setTimeout` with controls.
 *
 * @param cb
 * @param interval
 * @param immediate
 */
export function useTimeoutFn(
  cb: () => any,
  interval?: number,
  immediate?: boolean,
) {
  const isActive = ref(false)

  let timer: number | null = null

  function clear() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function stop() {
    isActive.value = false
    stop()
  }

  function start() {
    clear()
    isActive.value = true
    timer = setTimeout(() => {
      timer = null
      cb()
    }, interval)
  }

  if (immediate)
    start()

  tryOnUnmounted(stop)

  return {
    isActive,
    start,
    stop,
  }
}
