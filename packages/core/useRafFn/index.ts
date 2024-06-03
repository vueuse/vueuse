import { readonly, ref } from 'vue-demi'
import type { Pausable } from '@vueuse/shared'
import { tryOnScopeDispose, useRaf } from '@vueuse/shared'
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
  /**
   * The maximum frame per second to execute the function.
   * Set to `undefined` to disable the limit.
   *
   * @default undefined
   */
  fpsLimit?: number
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
    fpsLimit = undefined,
    window = defaultWindow,
  } = options

  const isActive = ref(false)
  const intervalLimit = fpsLimit ? 1000 / fpsLimit : null
  let previousFrameTimestamp = 0

  const { cancel, request } = useRaf((timestamp: DOMHighResTimeStamp) => {
    if (!isActive.value)
      return

    if (!previousFrameTimestamp)
      previousFrameTimestamp = timestamp

    const delta = timestamp - previousFrameTimestamp

    if (intervalLimit && delta < intervalLimit) {
      request()
      return
    }

    previousFrameTimestamp = timestamp
    fn({ delta, timestamp })
    request()
  })

  function resume() {
    if (!isActive.value && window) {
      isActive.value = true
      previousFrameTimestamp = 0
      request()
    }
  }

  function pause() {
    isActive.value = false
    cancel()
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
