import { readonly, ref } from 'vue-demi'
import type { Pausable } from '@vueuse/shared'
import { tryOnScopeDispose } from '@vueuse/shared'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export interface UseRafFnCallbackArguments {
  /**
   * Time elapsed between this and the last frame.
   */
  delta: number

  /**
   * Time elapsed since the creation of the web page. See {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#the_time_origin Time origin}.
   */
  timestamp: DOMHighResTimeStamp
}

export interface UseRafFnOptions extends ConfigurableWindow {
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
export function useRafFn(fn: (args: UseRafFnCallbackArguments) => void, options: UseRafFnOptions = {}): Pausable {
  const {
    immediate = true,
    window = defaultWindow,
  } = options

  const isActive = ref(false)
  let previousFrameTimestamp = 0
  let rafId: null | number = null

  function loop(timestamp: DOMHighResTimeStamp) {
    if (!isActive.value || !window)
      return

    const delta = timestamp - previousFrameTimestamp
    fn({ delta, timestamp })

    previousFrameTimestamp = timestamp
    rafId = window.requestAnimationFrame(loop)
  }

  function resume() {
    if (!isActive.value && window) {
      isActive.value = true
      rafId = window.requestAnimationFrame(loop)
    }
  }

  function pause() {
    isActive.value = false
    if (rafId != null && window) {
      window.cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  if (immediate)
    resume()

  tryOnScopeDispose(pause)

  return {
    isActive: readonly(isActive),
    pause,
    resume,
  }
}
