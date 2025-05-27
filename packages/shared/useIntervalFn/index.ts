import type { MaybeRefOrGetter } from 'vue'
import type { Pausable } from '../utils'
import { isRef, shallowReadonly, shallowRef, toValue, watch } from 'vue'
import { tryOnScopeDispose } from '../tryOnScopeDispose'
import { isClient } from '../utils'

export interface UseIntervalFnOptions {
  /**
   * Start the timer immediately
   *
   * @default true
   */
  immediate?: boolean

  /**
   * Execute the callback immediately after calling `resume`
   *
   * @default false
   */
  immediateCallback?: boolean
}

export type UseIntervalFnReturn = Pausable

/**
 * Wrapper for `setInterval` with controls
 *
 * @see https://vueuse.org/useIntervalFn
 * @param cb
 * @param interval
 * @param options
 */
export function useIntervalFn(cb: (UseIntervalFnReturn: UseIntervalFnReturn) => any, interval: MaybeRefOrGetter<number> = 1000, options: UseIntervalFnOptions = {}): UseIntervalFnReturn {
  const {
    immediate = true,
    immediateCallback = false,
  } = options

  let timer: ReturnType<typeof setInterval> | null = null
  const isActive = shallowRef(false)
  
  const returnControl = {
    isActive: shallowReadonly(isActive),
    pause,
    resume,
  }
  
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
    const intervalValue = toValue(interval)
    if (intervalValue <= 0)
      return
    isActive.value = true
    if (immediateCallback)
      cb(returnControl)
    clean()
    if (isActive.value)
      timer = setInterval(() => cb(returnControl), intervalValue)
  }

  if (immediate && isClient)
    resume()

  if (isRef(interval) || typeof interval === 'function') {
    const stopWatch = watch(interval, () => {
      if (isActive.value && isClient)
        resume()
    })
    tryOnScopeDispose(stopWatch)
  }

  tryOnScopeDispose(pause)

  return returnControl
}
