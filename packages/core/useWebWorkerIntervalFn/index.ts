import type { Pausable } from '@vueuse/shared'
import type { MaybeRefOrGetter } from 'vue'
import type { UseWebWorkerReturn } from '../useWebWorker'
import { isClient, tryOnScopeDispose } from '@vueuse/shared'
import { isRef, shallowReadonly, shallowRef, toValue, watch } from 'vue'
import { useWebWorker } from '../useWebWorker'
import { createIntervalBlobUrl } from './lib/createIntervalBlobUrl.ts'

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

export type WebWorkerIntervalStatus
  = | 'TICK'
    | 'ENDED'
    | 'STARTED'

/**
 * Wrapper for `webworker-setInterval` with controls
 *
 * @param cb
 * @param interval
 * @param options
 */

export function useWebWorkerIntervalFn(cb: () => void, interval: MaybeRefOrGetter<number> = 1000, options: useWebWorkerIntervalFnOptions = {}): useWebWorkerIntervalFnReturn {
  const {
    immediate = true,
    immediateCallback = false,
  } = options

  const isActive = shallowRef(false)

  let _url: string | undefined
  let webWorkResult: UseWebWorkerReturn | undefined

  const initWorker = () => {
    const blobUrl = createIntervalBlobUrl()
    const newWorker = useWebWorker(blobUrl)
    _url = blobUrl

    newWorker.worker.value!.onmessage = (ev: MessageEvent) => {
      const [status] = ev.data as [WebWorkerIntervalStatus, any]
      switch (status) {
        case 'TICK':
          cb()
          break
        default:
          pause()
          break
      }
    }

    return newWorker
  }

  function clean() {
    if (webWorkResult?.worker.value && _url && window) {
      webWorkResult.post(['ENDED'])
      webWorkResult.worker.value.terminate()
      URL.revokeObjectURL(_url)
      webWorkResult.worker.value = undefined
      webWorkResult = undefined
    }
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
      webWorkResult = initWorker()
      webWorkResult.post(['STARTED', intervalValue])
    }
  }

  if (immediate && isClient) {
    resume()
  }

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
