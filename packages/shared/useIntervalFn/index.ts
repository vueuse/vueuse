import { Fn, Pausable, tryOnUnmounted } from '@vueuse/shared'
import { ref } from 'vue-demi'

export interface IntervalFnReturn extends Pausable {
  /**
   * @deprecated use pause() instead
   */
  stop: Fn

  /**
   * @deprecated use resume() instead
   */
  start: Fn
}

/**
 * Wrapper for `setInterval` with controls
 *
 * @param cb
 * @param interval
 * @param immediate
 */
export function useIntervalFn(cb: Fn, interval = 1000, immediate = true): IntervalFnReturn {
  let timer: any = null
  const isActive = ref(false)

  function clean() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function pause() {
    isActive.value = false
    clean()
  }

  function resume() {
    isActive.value = true
    clean()
    timer = setInterval(cb, interval)
  }

  if (immediate)
    resume()

  tryOnUnmounted(pause)

  return {
    isActive,
    pause,
    resume,
    start: resume,
    stop: pause,
  }
}
