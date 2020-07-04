/* this implementation is a vue port of https://github.com/alewin/useWorker by Alessio Koci */

import { ref, onMounted, onUnmounted, Ref } from 'vue-demi'
import createWorkerBlobUrl from './lib/createWorkerBlobUrl'

export enum WorkerStatus {
  Pending = 'PENDING',
  Success = 'SUCCESS',
  Runing = 'RUNNING',
  Error = 'ERROR',
  TimeoutExpired = 'TIMEOUT_EXPIRED',
}

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

  const workerStatus: Ref<WorkerStatus> = ref(WorkerStatus.Pending)
  const promise: Ref<{ reject?: (result: ReturnType<T> | ErrorEvent) => void;resolve?: (result: ReturnType<T>) => void }> = ref({})
  const timeoutId: Ref<number | undefined> = ref(undefined)

  const workerTerminate = (status = WorkerStatus.Pending) => {
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
    workerTerminate()
  })

  onUnmounted(() => {
    workerTerminate()
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
      const [status, result] = e.data as [WorkerStatus, ReturnType<T>]

      switch (status) {
        case WorkerStatus.Success:
          resolve(result)
          workerTerminate(status)
          break
        default:
          reject(result)
          workerTerminate(WorkerStatus.Error)
          break
      }
    }

    newWorker.onerror = (e: ErrorEvent) => {
      const {
        reject = () => {},
      } = promise.value

      reject(e)
      workerTerminate(WorkerStatus.Error)
    }

    if (timeout) {
      timeoutId.value = window.setTimeout(() => {
        workerTerminate(WorkerStatus.TimeoutExpired)
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

    workerStatus.value = (WorkerStatus.Runing)
  })

  const workerFn = (...fnArgs: Parameters<T>) => {
    if (workerStatus.value === WorkerStatus.Runing) {
      /* eslint-disable-next-line no-console */
      console.error('[useWebWorkerFn] You can only run one instance of the worker at a time, if you want to run more than one in parallel, create another instance with the hook useWorker(). Read more: https://github.com/alewin/useWorker')
      /* eslint-disable-next-line prefer-promise-reject-errors */
      return Promise.reject()
    }

    worker.value = generateWorker()
    return callWorker(...fnArgs)
  }

  return {
    workerFn,
    workerStatus,
    workerTerminate,
  }
}
