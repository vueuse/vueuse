/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref, Ref } from 'vue-demi'
import { tryOnUnmounted } from '@vueuse/shared'

/**
 * Simple Web Workers registration and communication.
 *
 * @see   {@link https://vueuse.js.org/useWebWorker}
 * @param url
 */
export function useWebWorker(url: string) {
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

  worker = new Worker(url)

  worker.onmessage = (e: MessageEvent) => {
    data.value = e.data
  }

  tryOnUnmounted(() => {
    worker.terminate()
  })

  return {
    data,
    post,
    terminate,
  }
}
