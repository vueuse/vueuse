import { ref } from 'vue-demi'
import { Pausable, tryOnScopeDispose, Fn } from '@vueuse/shared'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export interface RafFnOptions extends ConfigurableWindow {
  /**
   * Start the requestAnimationFrame loop immediately on creation
   *
   * @default true
   */
  immediate?: boolean
}

/**
 * Call function on every `requestAnimationFrame`. With controls of pausing and resuming.
 *
 * @see https://vueuse.org/useRafFn
 * @param fn
 * @param options
 */
export function useRafFn(fn: Fn, options: RafFnOptions = {}): Pausable {
  const {
    immediate = true,
    window = defaultWindow,
  } = options

  const isActive = ref(false)

  function loop() {
    if (!isActive.value || !window)
      return

    fn()
    window.requestAnimationFrame(loop)
  }

  function resume() {
    if (!isActive.value && window) {
      isActive.value = true
      loop()
    }
  }

  function pause() {
    isActive.value = false
  }

  if (immediate)
    resume()

  tryOnScopeDispose(pause)

  return {
    isActive,
    pause,
    resume,
  }
}
