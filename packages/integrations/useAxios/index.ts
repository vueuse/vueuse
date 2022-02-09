import type { Ref } from 'vue-demi'
import { ref, shallowRef } from 'vue-demi'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios'
import axios from 'axios'

export interface UseAxiosReturn<T> {

  /**
   * Axios Response
   */
  response: Ref<AxiosResponse<T> | undefined>

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
  error: Ref<AxiosError<T> | undefined>

  /**
   * Aborts the current request
   */
  abort: (message?: string | undefined) => void

  /**
   * Manually call the axios request
   */
  execute: (config?: AxiosRequestConfig) => void
}
export interface UseAxiosOptions {
  /**
   * Will automatically run axios request when `useAxios` is used
   *
   * @default true
   */
  immediate?: boolean
}

export function useAxios<T = any>(url: string, config?: AxiosRequestConfig, options?: UseAxiosOptions): UseAxiosReturn<T>
export function useAxios<T = any>(url: string, instance?: AxiosInstance, options?: UseAxiosOptions): UseAxiosReturn<T>
export function useAxios<T = any>(url: string, config: AxiosRequestConfig, instance: AxiosInstance, options?: UseAxiosOptions): UseAxiosReturn<T>

/**
 * Wrapper for axios.
 *
 * @see https://vueuse.org/useAxios
 * @param url
 * @param config
 */
export function useAxios<T = any>(url: string, ...args: any[]) {
  let defaultConfig: AxiosRequestConfig = {}
  let instance: AxiosInstance = axios
  let options: UseAxiosOptions = { immediate: true }
  if (args.length > 0) {
    /**
     * Unable to use `instanceof` here becuase of (https://github.com/axios/axios/issues/737)
     * so instead we are checking if there is a `requset` on the object to see if it is an
     * axios instance
     */
    if ('request' in args[0])
      instance = args[0]
    else
      defaultConfig = args[0]
  }

  if (args.length > 1) {
    if ('request' in args[1])
      instance = args[1]
  }
  if (args.length >= 2)
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
  const execute = (config: AxiosRequestConfig = {}) => {
    loading(true)
    instance(url, { ...defaultConfig, ...config, cancelToken: cancelToken.token })
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
  if (options.immediate) execute()

  return {
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
  }
}
