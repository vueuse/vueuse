import { ref } from 'vue-demi'
import { useTimeoutFn } from '../useTimeoutFn'

/**
 * Update value after a given time with controls.
 *
 * @param interval
 * @param immediate
 */
export function useTimeout(interval = 1000, immediate = true) {
  const ready = ref(false)

  const controls = useTimeoutFn(
    () => ready.value = true,
    interval,
    immediate,
  )

  function stop() {
    ready.value = false
    controls.stop()
  }

  function start() {
    ready.value = false
    controls.start()
  }

  return {
    ready,
    isActive: controls.isActive,
    start,
    stop,
  }
}
