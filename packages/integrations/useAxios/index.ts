import type { Ref, ShallowRef } from 'vue-demi'
import { ref, shallowRef } from 'vue-demi'
import { until } from '@vueuse/shared'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios'
import axios from 'axios'

export interface UseAxiosReturn<T> {

  /**
   * Axios Response
   */
  response: ShallowRef<AxiosResponse<T> | undefined>

  /**
   * Axios response data
   */
  data: Ref<T | undefined>

  /**
   * Indicates if the request has finished
   */
  isFinished: Ref<boolean>

  /**
   * Indicates if the request is currently loading
   */
  isLoading: Ref<boolean>

  /**
   * Indicates if the request was canceled
   */
  aborted: Ref<boolean>

  /**
   * Any errors that may have occurred
   */
  error: ShallowRef<AxiosError<T> | undefined>

  /**
   * Aborts the current request
   */
  abort: (message?: string | undefined) => void

  /**
   * isFinished alias
   */
  finished: Ref<boolean>

  /**
   * loading alias
   */
  loading: Ref<boolean>

  /**
   * abort alias
   */
  cancel: (message?: string | undefined) => void

  /**
   * abort aborted
   */
  canceled: Ref<boolean>
}
export interface StrictUseAxiosReturn<T> extends UseAxiosReturn<T> {
  /**
   * Manually call the axios request
   */
  execute: (url?: string, config?: AxiosRequestConfig) => void
}
export interface EasyUseAxiosReturn<T> extends UseAxiosReturn<T> {
  /**
   * Manually call the axios request
   */
  execute: (url: string, config?: AxiosRequestConfig) => void
}
export interface UseAxiosOptions {
  /**
   * Will automatically run axios request when `useAxios` is used
   *
   */
  immediate?: boolean
}
type OverallUseAxiosReturn<T> = StrictUseAxiosReturn<T> | EasyUseAxiosReturn<T>
export function useAxios<T = any>(url: string, config?: AxiosRequestConfig, options?: UseAxiosOptions): StrictUseAxiosReturn<T> & PromiseLike<StrictUseAxiosReturn<T>>
export function useAxios<T = any>(url: string, instance?: AxiosInstance, options?: UseAxiosOptions): StrictUseAxiosReturn<T> & PromiseLike<StrictUseAxiosReturn<T>>
export function useAxios<T = any>(url: string, config: AxiosRequestConfig, instance: AxiosInstance, options?: UseAxiosOptions): StrictUseAxiosReturn<T> & PromiseLike<StrictUseAxiosReturn<T>>
export function useAxios<T = any>(config?: AxiosRequestConfig): EasyUseAxiosReturn<T> & PromiseLike<EasyUseAxiosReturn<T>>
export function useAxios<T = any>(instance?: AxiosInstance): EasyUseAxiosReturn<T> & PromiseLike<EasyUseAxiosReturn<T>>
export function useAxios<T = any>(config?: AxiosRequestConfig, instance?: AxiosInstance): EasyUseAxiosReturn<T> & PromiseLike<EasyUseAxiosReturn<T>>
/**
 * Wrapper for axios.
 *
 * @see https://vueuse.org/useAxios
 * @param url
 * @param config
 */
export function useAxios<T = any>(...args: any[]): OverallUseAxiosReturn<T> & PromiseLike<OverallUseAxiosReturn<T>> {
  const url: string | undefined = typeof args[0] === 'string' ? args[0] : undefined
  const argsPlaceholder = url ? 1 : 0
  let defaultConfig: AxiosRequestConfig = {}
  let instance: AxiosInstance = axios
  let options: UseAxiosOptions = { immediate: !!argsPlaceholder }
  if (args.length > 0 + argsPlaceholder) {
    /**
     * Unable to use `instanceof` here becuase of (https://github.com/axios/axios/issues/737)
     * so instead we are checking if there is a `requset` on the object to see if it is an
     * axios instance
     */
    if ('request' in args[0 + argsPlaceholder])
      instance = args[0 + argsPlaceholder]
    else
      defaultConfig = args[0 + argsPlaceholder]
  }

  if (args.length > 1 + argsPlaceholder) {
    if ('request' in args[1 + argsPlaceholder])
      instance = args[1 + argsPlaceholder]
  }
  if (
    (args.length === 2 + argsPlaceholder && !('request' in args[1 + argsPlaceholder]))
    || args.length === 3 + argsPlaceholder
  )
    options = args[args.length - 1]

  const response = shallowRef<AxiosResponse<T>>()
  const data = shallowRef<T>()
  const isFinished = ref(false)
  const isLoading = ref(false)
  const aborted = ref(false)
  const error = shallowRef<AxiosError<T>>()

  const cancelToken: CancelTokenSource = axios.CancelToken.source()
  const abort = (message?: string) => {
    if (isFinished.value || !isLoading.value) return

    cancelToken.cancel(message)
    aborted.value = true
    isLoading.value = false
    isFinished.value = false
  }
  const loading = (loading: boolean) => {
    isLoading.value = loading
    isFinished.value = !loading
  }
  const execute: OverallUseAxiosReturn<T>['execute'] = (executeUrl: string | AxiosRequestConfig | undefined = url, config: AxiosRequestConfig = {}) => {
    let _url = url ?? ''
    let _config
    if (typeof executeUrl === 'string') {
      _url = executeUrl
      _config = config
    }
    else {
      _config = config
    }
    loading(true)
    instance(_url, { ...defaultConfig, ..._config, cancelToken: cancelToken.token })
      .then((r: any) => {
        response.value = r
        data.value = r.data
      })
      .catch((e: any) => {
        error.value = e
      })
      .finally(() => {
        loading(false)
      })
  }
  if (options.immediate && url) (execute as StrictUseAxiosReturn<T>['execute'])()

  const result = {
    response,
    data,
    error,
    finished: isFinished,
    loading: isLoading,
    isFinished,
    isLoading,
    cancel: abort,
    canceled: aborted,
    aborted,
    abort,
    execute,
  } as OverallUseAxiosReturn<T>
  function waitUntilFinished() {
    return new Promise<OverallUseAxiosReturn<T>>((resolve, reject) => {
      until(isFinished).toBe(true)
        .then(() => resolve(result))
        .catch(error => reject(error))
    })
  }

  return {
    ...result,
    then(onFulfilled, onRejected) {
      return waitUntilFinished()
        .then(onFulfilled, onRejected)
    },
  }
}
