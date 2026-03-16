/* this implementation is a vue port of https://github.com/alewin/useWorker by Alessio Koci */

import type { ShallowRef } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import { tryOnScopeDispose } from '@vueuse/shared'
import { shallowRef } from 'vue'
import { defaultWindow } from '../_configurable'
import createWorkerBlobUrl from './lib/createWorkerBlobUrl'

export type WebWorkerStatus
  = | 'PENDING'
    | 'SUCCESS'
    | 'RUNNING'
    | 'ERROR'
    | 'TIMEOUT_EXPIRED'

export interface UseWebWorkerOptions extends ConfigurableWindow {
  /**
   * Number of milliseconds before killing the worker
   *
   * @default undefined
   */
  timeout?: number
  /**
   * An array that contains the external dependencies needed to run the worker
   */
  dependencies?: string[]
  /**
   * An array that contains the local dependencies needed to run the worker
   */
  localDependencies?: Function[]
}

export interface UseWebWorkerFnReturn<T extends (...fnArgs: any[]) => any> {
  workerFn: (...fnArgs: Parameters<T>) => Promise<ReturnType<T>>
  workerStatus: ShallowRef<WebWorkerStatus>
  workerTerminate: (status?: WebWorkerStatus) => void
}

/**
 * Run expensive function without blocking the UI, using a simple syntax that makes use of Promise.
 *
 * @see https://vueuse.org/useWebWorkerFn
 * @param fn
 * @param options
 */
export function useWebWorkerFn<T extends (...fnArgs: any[]) => any>(fn: T, options: UseWebWorkerOptions = {}): UseWebWorkerFnReturn<T> {
  const {
    dependencies = [],
    localDependencies = [],
    timeout,
    window = defaultWindow,
  } = options

  let worker: (Worker & { _url?: string }) | undefined
  const workerStatus = shallowRef<WebWorkerStatus>('PENDING')
  const promise = shallowRef<({ reject?: (result: ReturnType<T> | ErrorEvent) => void, resolve?: (result: ReturnType<T>) => void })>({})
  const timeoutId = shallowRef<number>()

  const workerTerminate = (status: WebWorkerStatus = 'PENDING') => {
    if (worker && worker._url && window) {
      worker.terminate()
      URL.revokeObjectURL(worker._url)
      promise.value = {}
      worker = undefined
      window.clearTimeout(timeoutId.value)
      workerStatus.value = status
    }
  }

  workerTerminate()

  tryOnScopeDispose(workerTerminate)

  const generateWorker = () => {
    const blobUrl = createWorkerBlobUrl(fn, dependencies, localDependencies)
    const newWorker: Worker & { _url?: string } = new Worker(blobUrl)
    newWorker._url = blobUrl

    newWorker.onmessage = (e: MessageEvent) => {
      const { resolve = () => { }, reject = () => { } } = promise.value
      const [status, result] = e.data as [WebWorkerStatus, ReturnType<T>]

      switch (status) {
        case 'SUCCESS':
          resolve(result)
          workerTerminate(status)
          break
        default:
          reject(result)
          workerTerminate('ERROR')
          break
      }
    }

    newWorker.onerror = (e: ErrorEvent) => {
      const { reject = () => { } } = promise.value
      e.preventDefault()
      reject(e)
      workerTerminate('ERROR')
    }

    if (timeout) {
      timeoutId.value = setTimeout(
        () => workerTerminate('TIMEOUT_EXPIRED'),
        timeout,
      ) as any
    }
    return newWorker
  }

  const callWorker = (...fnArgs: Parameters<T>) => new Promise<ReturnType<T>>((resolve, reject) => {
    promise.value = {
      resolve,
      reject,
    }
    worker?.postMessage([[...fnArgs]])

    workerStatus.value = 'RUNNING'
  })

  const workerFn = (...fnArgs: Parameters<T>) => {
    if (workerStatus.value === 'RUNNING') {
      console.error(
        '[useWebWorkerFn] You can only run one instance of the worker at a time.',
      )
      /* eslint-disable-next-line prefer-promise-reject-errors */
      return Promise.reject()
    }

    worker = generateWorker()
    return callWorker(...fnArgs)
  }

  return {
    workerFn,
    workerStatus,
    workerTerminate,
  }
}
