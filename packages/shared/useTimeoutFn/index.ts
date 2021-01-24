import { ref } from 'vue-demi'
import { tryOnUnmounted } from '../tryOnUnmounted'
import { isClient } from '../utils'

/**
 * Wrapper for `setTimeout` with controls.
 *
 * @param cb
 * @param interval
 * @param immediate
 */
export function useTimeoutFn(
  cb: (...args: unknown[]) => any,
  interval?: number,
  immediate = true,
) {
  const isActive = ref(false)
  const isPending = ref(false)

  let timer: number | null = null

  function clear() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function stop() {
    isActive.value = false
    isPending.value = false
    clear()
  }

  function start(...args: unknown[]) {
    clear()
    isActive.value = true
    isPending.value = true
    timer = setTimeout(() => {
      isPending.value = false
      timer = null
      // eslint-disable-next-line standard/no-callback-literal
      cb(...args)
    }, interval)
  }

  if (immediate && isClient)
    start()

  tryOnUnmounted(stop)

  return {
    isActive,
    start,
    stop,
  }
}
