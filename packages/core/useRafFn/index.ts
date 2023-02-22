import { readonly, computed, ref } from 'vue-demi'
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
  immediate?: boolean,
  /**
   * two function works at intervals of the certain frames that you set
   *
   * @default 1
   */
  intervalFrame?: number
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

  const intervalFrame = computed(() => {
    if (typeof options.intervalFrame === 'number') {
      return Number(options.intervalFrame) >= 1 ? Number(options.intervalFrame) : 1
    } else {
      return 1
    }
  })
  const isActive = ref(false)
  let previousFrameTimestamp = 0
  let rafId: null | number = null

  function requestAnimationFrame(fn: (timestamp: DOMHighResTimeStamp) => void) {
    let i = 0
    function loop() {
      i++
      if (i >= intervalFrame.value) {
        rafId = window!.requestAnimationFrame(fn)
        return
      }
      window!.requestAnimationFrame(loop)
    }
    loop()
  }

  function loop(timestamp: DOMHighResTimeStamp) {
    if (!isActive.value || !window)
      return

    const delta = timestamp - previousFrameTimestamp
    fn({ delta, timestamp })

    previousFrameTimestamp = timestamp
    requestAnimationFrame(loop)
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
