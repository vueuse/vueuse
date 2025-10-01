import type { MaybeRefOrGetter } from 'vue'
import type { Fn, Pausable, SchedulerOptions } from '../utils'
import { isRef, shallowReadonly, shallowRef, toValue, watch } from 'vue'
import { tryOnScopeDispose } from '../tryOnScopeDispose'
import { isClient } from '../utils'

export type UseIntervalFnOptions = Omit<SchedulerOptions, 'interval'>

export interface UseIntervalFnReturn extends Pausable {
}

/**
 * Wrapper for `setInterval` with controls
 *
 * @see https://vueuse.org/useIntervalFn
 */
export function useIntervalFn(cb: Fn, interval: MaybeRefOrGetter<number>, options?: UseIntervalFnOptions): UseIntervalFnReturn
export function useIntervalFn(cb: Fn, options?: SchedulerOptions): UseIntervalFnReturn

export function useIntervalFn(cb: Fn, intervalOrOptions?: MaybeRefOrGetter<number> | SchedulerOptions, options?: UseIntervalFnOptions): UseIntervalFnReturn {
  if (typeof toValue(intervalOrOptions) === 'number') {
    intervalOrOptions = {
      ...options,
      interval: intervalOrOptions,
    } as SchedulerOptions
  }

  const {
    interval = 1000,
    immediate = true,
    immediateCallback = false,
  } = (intervalOrOptions ?? {}) as SchedulerOptions

  let timer: ReturnType<typeof setInterval> | null = null
  const isActive = shallowRef(false)

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
      cb()
    clean()
    if (isActive.value)
      timer = setInterval(cb, intervalValue)
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

  return {
    isActive: shallowReadonly(isActive),
    pause,
    resume,
  }
}
