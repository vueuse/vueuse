import { isRef, ref, unref, watch } from 'vue-demi'
import { tryOnScopeDispose } from '../tryOnScopeDispose'
import type { Fn, MaybeRef, Pausable } from '../utils'
import { isClient } from '../utils'

export interface IntervalFnOptions {
  /**
   * Start the timer immediately
   *
   * @default true
   */
  immediate?: boolean

  /**
   * Execute the callback immediate after calling this function
   *
   * @default false
   */
  immediateCallback?: boolean
}

/**
 * Wrapper for `setInterval` with controls
 *
 * @param cb
 * @param interval
 * @param options
 */
export function useIntervalFn(cb: Fn, interval: MaybeRef<number> = 1000, options: IntervalFnOptions = {}): Pausable {
  const {
    immediate = true,
    immediateCallback = false,
  } = options

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
    if (interval <= 0)
      return
    isActive.value = true
    if (immediateCallback)
      cb()
    clean()
    timer = setInterval(cb, unref(interval))
  }

  if (immediate && isClient)
    resume()

  if (isRef(interval)) {
    const stopWatch = watch(interval, () => {
      if (immediate && isClient)
        resume()
    })
    tryOnScopeDispose(stopWatch)
  }

  tryOnScopeDispose(pause)

  return {
    isActive,
    pause,
    resume,
  }
}
