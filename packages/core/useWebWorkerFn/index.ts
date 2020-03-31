/* this implementation is a vue port of https://github.com/alewin/useWorker by Alessio Koci */

import { ref, onMounted, onUnmounted, Ref } from '../../api'
import WORKER_STATUS from './lib/status'
import createWorkerBlobUrl from './lib/createWorkerBlobUrl'

type Options = {
  timeout?: number
  dependencies?: string[]
}

const DEFAULT_OPTIONS: Options = {
  timeout: undefined,
  dependencies: [],
}

/* eslint-disable arrow-parens */
export const useWebWorkerFn = <T extends (...fnArgs: any[]) => any>(
  fn: T, options: Options = DEFAULT_OPTIONS,
) => {
  /* eslint-enable arrow-parens */
  const worker: Ref<Worker & { _url?: string } | undefined> = ref(undefined)

  const workerStatus: Ref<WORKER_STATUS> = ref(WORKER_STATUS.PENDING)
  const promise: Ref<{ reject?: (result: ReturnType<T> | ErrorEvent) => void;resolve?: (result: ReturnType<T>) => void }> = ref({})
  const timeoutId: Ref<number | undefined> = ref(undefined)

  const killWorker = (status = WORKER_STATUS.PENDING) => {
    if (worker.value && worker.value._url) {
      worker.value.terminate()
      URL.revokeObjectURL(worker.value._url)
      promise.value = {}
      worker.value = undefined
      window.clearTimeout(timeoutId.value)
      workerStatus.value = status
    }
  }

  onMounted(() => {
    killWorker()
  })

  onUnmounted(() => {
    killWorker()
  })

  const generateWorker = () => {
    const {
      dependencies = DEFAULT_OPTIONS.dependencies || [],
      timeout = DEFAULT_OPTIONS.timeout,
    } = options
    const blobUrl = createWorkerBlobUrl(fn, dependencies)
    const newWorker: Worker & { _url?: string } = new Worker(blobUrl)
    newWorker._url = blobUrl

    newWorker.onmessage = (e: MessageEvent) => {
      const {
        resolve = () => {},
        reject = () => {},
      } = promise.value
      const [status, result] = e.data as [WORKER_STATUS, ReturnType<T>]

      switch (status) {
        case WORKER_STATUS.SUCCESS:
          resolve(result)
          killWorker(status)
          break
        default:
          reject(result)
          killWorker(WORKER_STATUS.ERROR)
          break
      }
    }

    newWorker.onerror = (e: ErrorEvent) => {
      const {
        reject = () => {},
      } = promise.value

      reject(e)
      killWorker(WORKER_STATUS.ERROR)
    }

    if (timeout) {
      timeoutId.value = window.setTimeout(() => {
        killWorker(WORKER_STATUS.TIMEOUT_EXPIRED)
      }, timeout)
    }
    return newWorker
  }

  const callWorker = (...fnArgs: Parameters<T>) => new Promise<ReturnType<T>>((resolve, reject) => {
    promise.value = {
      resolve,
      reject,
    }
    worker.value && worker.value.postMessage([[...fnArgs]])

    workerStatus.value = (WORKER_STATUS.RUNNING)
  })

  const workerHook = (...fnArgs: Parameters<T>) => {
    if (workerStatus.value === WORKER_STATUS.RUNNING) {
      /* eslint-disable-next-line no-console */
      console.error('[useWebWorkerFn] You can only run one instance of the worker at a time, if you want to run more than one in parallel, create another instance with the hook useWorker(). Read more: https://github.com/alewin/useWorker')
      /* eslint-disable-next-line prefer-promise-reject-errors */
      return Promise.reject()
    }

    worker.value = generateWorker()
    return callWorker(...fnArgs)
  }

  return {
    workerHook,
    workerStatus: workerStatus.value,
    killWorker,
  }
}
