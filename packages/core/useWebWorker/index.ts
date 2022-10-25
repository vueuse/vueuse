/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import type { Ref, ShallowRef } from 'vue-demi'
import { ref, shallowRef } from 'vue-demi'
import { isFunction, isString, tryOnScopeDispose } from '@vueuse/shared'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export interface UseWebWorkerReturn<Data = any> {
  data: Ref<Data>
  post: typeof Worker.prototype['postMessage']
  terminate: () => void
  worker: ShallowRef<Worker | undefined>
}

type WorkerFn = (...args: unknown[]) => Worker

/**
 * Simple Web Workers registration and communication.
 *
 * @see https://vueuse.org/useWebWorker
 * @param url
 * @param workerOptions
 * @param options
 */
export function useWebWorker<T = any>(
  url: string,
  workerOptions?: WorkerOptions,
  options?: ConfigurableWindow,
): UseWebWorkerReturn<T>

/**
 * Simple Web Workers registration and communication.
 *
 * @see https://vueuse.org/useWebWorker
 * @param worker
 */
export function useWebWorker<T = any>(
  worker: Worker | WorkerFn
): UseWebWorkerReturn<T>

export function useWebWorker<Data = any>(
  arg0: string | WorkerFn | Worker,
  workerOptions?: WorkerOptions,
  options?: ConfigurableWindow,
): UseWebWorkerReturn<Data> {
  const {
    window = defaultWindow,
  } = options ?? {}

  const data: Ref<any> = ref(null)
  const worker = shallowRef<Worker>()

  const post: typeof Worker.prototype['postMessage'] = function post(val: any) {
    if (!worker.value)
      return

    worker.value.postMessage(val)
  }

  const terminate: typeof Worker.prototype['terminate'] = function terminate() {
    if (!worker.value)
      return

    worker.value.terminate()
  }

  if (window) {
    if (isString(arg0))
      worker.value = new Worker(arg0, workerOptions)
    else if (isFunction(arg0))
      worker.value = (arg0 as any)()
    else
      worker.value = arg0

    worker.value!.onmessage = (e: MessageEvent) => {
      data.value = e.data
    }

    tryOnScopeDispose(() => {
      if (worker.value)
        worker.value.terminate()
    })
  }

  return {
    data,
    post,
    terminate,
    worker,
  }
}
