import { Ref, ref, shallowRef } from 'vue-demi'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, CancelTokenSource, AxiosInstance } from 'axios'

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
}

export function useAxios<T = any>(url: string, config?: AxiosRequestConfig): UseAxiosReturn<T>
export function useAxios<T = any>(url: string, instance?: AxiosInstance): UseAxiosReturn<T>
export function useAxios<T = any>(url: string, config: AxiosRequestConfig, instance: AxiosInstance): UseAxiosReturn<T>

/**
 * Wrapper for axios.
 *
 * @see https://vueuse.org/useAxios
 * @param url
 * @param config
 */
export function useAxios<T = any>(url: string, ...args: any[]) {
  let config: AxiosRequestConfig = {}
  let instance: AxiosInstance = axios

  if (args.length > 0) {
    /**
     * Unable to use `instanceof` here becuase of (https://github.com/axios/axios/issues/737)
     * so instead we are checking if there is a `requset` on the object to see if it is an
     * axios instance
     */
    if ('request' in args[0])
      instance = args[0]
    else
      config = args[0]
  }

  if (args.length > 1) {
    if ('request' in args[1])
      instance = args[1]
  }

  const response = shallowRef<AxiosResponse<T>>()
  const data = shallowRef<T>()
  const isFinished = ref(false)
  const isLoading = ref(true)
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

  instance(url, { ...config, cancelToken: cancelToken.token })
    .then((r: any) => {
      response.value = r
      data.value = r.data
    })
    .catch((e: any) => {
      error.value = e
    })
    .finally(() => {
      isLoading.value = false
      isFinished.value = true
    })

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
  }
}
