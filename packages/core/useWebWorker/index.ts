/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref, Ref } from 'vue-demi'
import { tryOnUnmounted } from '@vueuse/shared'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

/**
 * Simple Web Workers registration and communication.
 *
 * @see https://vueuse.org/useWebWorker
 * @param url
 * @param workerOptions
 * @param options
 */
export function useWebWorker(
  url: string,
  workerOptions?: WorkerOptions,
  options: ConfigurableWindow = {},
) {
  const {
    window = defaultWindow,
  } = options

  const data: Ref<any> = ref(null)
  let worker: Worker

  const post: typeof worker.postMessage = function post(val: any) {
    if (!worker)
      return

    worker.postMessage(val)
  }

  const terminate: typeof worker.terminate = function terminate() {
    if (!worker)
      return

    worker.terminate()
  }

  if (window) {
    // @ts-expect-error untyped
    worker = new window.Worker(url, workerOptions)

    worker.onmessage = (e: MessageEvent) => {
      data.value = e.data
    }

    tryOnUnmounted(() => {
      worker.terminate()
    })
  }

  return {
    data,
    post,
    terminate,
  }
}
