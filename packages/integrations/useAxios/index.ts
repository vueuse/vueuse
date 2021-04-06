import { Ref, ref, shallowRef } from 'vue-demi'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, CancelTokenSource, AxiosInstance } from 'axios'

export interface UseAxiosReturn<T> {
  response: Ref<AxiosResponse<T> | undefined>
  data: Ref<T | undefined>
  finished: Ref<boolean>
  loading: Ref<boolean>
  canceled: Ref<boolean>
  error: Ref<AxiosError<T> | undefined>
}

export function useAxios<T = any>(url: string, config?: AxiosRequestConfig): UseAxiosReturn<T>
export function useAxios<T = any>(url: string, instance?: AxiosInstance): UseAxiosReturn<T>
export function useAxios<T = any>(url: string, config: AxiosRequestConfig, instance: AxiosInstance): UseAxiosReturn<T>

/**
 * Wrapper for axios.
 *
 * @link https://vueuse.org/useAxios
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
  const finished = ref(false)
  const loading = ref(true)
  const canceled = ref(false)
  const error = shallowRef<AxiosError<T>>()

  const cancelToken: CancelTokenSource = axios.CancelToken.source()
  const cancel = (message?: string) => {
    if (finished.value || !loading.value) return

    cancelToken.cancel(message)
    canceled.value = true
    loading.value = false
    finished.value = false
  }

  instance(url, { ...config, cancelToken: cancelToken.token })
    .then((r: AxiosResponse<T>) => {
      response.value = r
      data.value = r.data
    })
    .catch((e) => {
      error.value = e
    })
    .finally(() => {
      loading.value = false
      finished.value = true
    })

  return {
    response,
    data,
    error,
    finished,
    loading,
    cancel,
    canceled,
  }
}
