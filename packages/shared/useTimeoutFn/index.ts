import type { ShallowRef } from 'vue-demi'
import { readonly, ref } from 'vue-demi'
import type { AnyFn, MaybeRefOrGetter, Pausable, Stoppable } from '../utils'
import { toValue } from '../toValue'
import { tryOnScopeDispose } from '../tryOnScopeDispose'
import { isClient } from '../utils'

export interface UseTimeoutFnOptions {
  /**
   * Start the timer immediate after calling this function
   *
   * @default true
   */
  immediate?: boolean
}

/**
 * Wrapper for `setTimeout` with controls.
 *
 * @param cb
 * @param interval
 * @param options
 */
export function useTimeoutFn<CallbackFn extends AnyFn>(
  cb: CallbackFn,
  interval: MaybeRefOrGetter<number>,
  options: UseTimeoutFnOptions = {},
): Stoppable<Parameters<CallbackFn> | []> & Pausable & { timeLeft: ShallowRef<number> } {
  const {
    immediate = true,
  } = options

  const isPending = ref(false)

  const isActive = ref(false)
  const startedAt = ref(-1)
  const timeLeft = ref(-1)

  let timer: ReturnType<typeof setTimeout> | null = null

  function clear() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function stop() {
    isPending.value = false
    isActive.value = false
    clear()
  }

  function setTimer(ms: number, ...args: Parameters<CallbackFn> | []) {
    timer = setTimeout(() => {
      isPending.value = false
      isActive.value = false
      timer = null

      cb(...args)
    }, ms)
  }

  function start(...args: Parameters<CallbackFn> | []) {
    clear()
    startedAt.value = new Date().getTime()
    isPending.value = true
    isActive.value = true
    timeLeft.value = toValue(interval)

    setTimer(toValue(interval), ...args)
  }

  function pause() {
    if (timer) {
      clearTimeout(timer)
      timer = null

      isActive.value = false
      const diff = timeLeft.value - (new Date().getTime() - startedAt.value)
      timeLeft.value = diff
    }
  }

  function resume(...args: Parameters<CallbackFn> | []) {
    startedAt.value = new Date().getTime()
    isActive.value = true

    setTimer(timeLeft.value, ...args)
  }

  if (immediate) {
    isPending.value = true
    if (isClient)
      start()
  }

  tryOnScopeDispose(stop)

  return {
    isPending: readonly(isPending),
    start,
    stop,
    timeLeft: readonly(timeLeft),
    isActive: readonly(isActive),
    pause,
    resume,
  }
}
