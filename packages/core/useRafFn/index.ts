import type { Pausable } from '@vueuse/shared'
import type { MaybeRefOrGetter } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import { tryOnScopeDispose } from '@vueuse/shared'
import { computed, readonly, shallowRef, toValue } from 'vue'
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
  fpsLimit?: MaybeRefOrGetter<number>
  /**
   * After the requestAnimationFrame loop executed once, it will be automatically stopped.
   *
   * @default false
   */
  once?: boolean
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
    once = false,
  } = options

  const isActive = shallowRef(false)
  const intervalLimit = computed(() => {
    return fpsLimit ? 1000 / toValue(fpsLimit) : null
  })
  let previousFrameTimestamp = 0
  let rafId: null | number = null

  function loop(timestamp: DOMHighResTimeStamp) {
    if (!isActive.value || !window)
      return

    if (!previousFrameTimestamp)
      previousFrameTimestamp = timestamp

    const delta = timestamp - previousFrameTimestamp

    if (intervalLimit.value && delta < intervalLimit.value) {
      rafId = window.requestAnimationFrame(loop)
      return
    }

    previousFrameTimestamp = timestamp
    fn({ delta, timestamp })
    if (once) {
      isActive.value = false
      rafId = null
      return
    }
    rafId = window.requestAnimationFrame(loop)
  }

  function resume() {
    if (!isActive.value && window) {
      isActive.value = true
      previousFrameTimestamp = 0
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
