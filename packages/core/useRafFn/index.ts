import { ref } from 'vue-demi'
import { Pausable, tryOnUnmounted, Fn } from '@vueuse/shared'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export interface RafFnOptions extends ConfigurableWindow {
  /**
   * Start the requestAnimationFrame loop immediately on creation
   *
   * @default true
   */
  immediate?: boolean
}

export interface RafFnReturn extends Pausable {
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
 * Call function on every `requestAnimationFrame`. With controls of pausing and resuming.
 *
 * @see https://vueuse.org/useRafFn
 * @param fn
 * @param options
 */
export function useRafFn(fn: Fn, options: RafFnOptions = {}): RafFnReturn {
  const {
    immediate = true,
    window = defaultWindow,
  } = options

  const isActive = ref(false)

  function loop() {
    if (!isActive.value)
      return
    fn()
    if (window)
      window.requestAnimationFrame(loop)
  }

  function resume() {
    if (!isActive.value) {
      isActive.value = true
      loop()
    }
  }

  function pause() {
    isActive.value = false
  }

  if (immediate)
    resume()

  tryOnUnmounted(pause)

  return {
    isActive,
    pause,
    resume,
    stop: pause,
    start: resume,
  }
}
