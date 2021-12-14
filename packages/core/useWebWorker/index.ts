/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import type { Ref } from 'vue-demi'
import { ref, shallowRef } from 'vue-demi'
import { tryOnScopeDispose } from '@vueuse/shared'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export interface UseWebWorkerReturn<Data = any> {
  data: Ref<Data>
  post: typeof Worker.prototype['postMessage']
  terminate: () => void
  worker: Ref<Worker | undefined>
}

/**
 * Simple Web Workers registration and communication.
 *
 * @see https://vueuse.org/useWebWorker
 * @param url
 * @param workerOptions
 * @param options
 */
export function useWebWorker<Data = any>(
  url: string,
  workerOptions?: WorkerOptions,
  options: ConfigurableWindow = {},
): UseWebWorkerReturn<Data> {
  const {
    window = defaultWindow,
  } = options

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
    // @ts-expect-error untyped
    worker.value = new window.Worker(url, workerOptions)

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
