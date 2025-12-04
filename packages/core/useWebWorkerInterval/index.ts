import type { Pausable } from '@vueuse/shared'
import type { MaybeRefOrGetter } from 'vue'
import { useWebWorkerFn } from '@vueuse/core/useWebWorkerFn'
import { isClient, tryOnScopeDispose } from '@vueuse/shared'
import { isRef, shallowReadonly, shallowRef, toValue, watch } from 'vue'

export interface useWebWorkerIntervalFnOptions {
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

export type useWebWorkerIntervalFnReturn = Pausable

function schedulerTask(interval: number = 1000) {
  return new Promise((resolve) => {
    const timer = setTimeout(async () => {
      resolve(undefined)
      clearTimeout(timer)
    }, interval)
  })
}

/**
 * Wrapper for `webworker-setInterval` with controls
 *
 * @param cb
 * @param interval
 * @param options
 */

export function useWebWorkerInterval(cb: () => void, interval: MaybeRefOrGetter<number> = 1000, options: useWebWorkerIntervalFnOptions = {}): useWebWorkerIntervalFnReturn {
  const {
    immediate = true,
    immediateCallback = false,
  } = options

  const isActive = shallowRef(false)

  const { workerFn, workerTerminate } = useWebWorkerFn(schedulerTask)

  function clean() {
    workerTerminate('SUCCESS')
  }

  function pause() {
    isActive.value = false
    clean()
  }

  function resume() {
    const intervalValue = toValue(interval)
    if (intervalValue <= 0) {
      return
    }
    isActive.value = true
    if (immediateCallback) {
      cb()
    }
    clean()
    if (isActive.value) {
      workerFn(intervalValue).then(() => {
        if (isActive.value) {
          cb()
          resume()
        }
      })
    }
  }

  if (immediate && isClient) {
    resume()
  }

  if (isRef(interval) || typeof interval === 'function') {
    const stopWatch = watch(interval, () => {
      if (isActive.value && isClient) {
        resume()
      }
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
