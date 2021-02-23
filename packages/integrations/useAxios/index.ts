import { Ref, ref } from 'vue-demi'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, CancelTokenSource, AxiosInstance } from 'axios'

interface UseAxiosReturn<T> {
  response: Ref<AxiosResponse<T> | undefined>
  data: Ref<T | undefined>
  finished: Ref<boolean>
  canceled: Ref<boolean>
  error: Ref<AxiosError<T> | undefined>
}

export function useAxios<T = any>(url: string, config?: AxiosRequestConfig): UseAxiosReturn<T>
export function useAxios<T = any>(url: string, instance?: AxiosInstance): UseAxiosReturn<T>
export function useAxios<T = any>(url: string, config: AxiosRequestConfig, instance: AxiosInstance): UseAxiosReturn<T>

/**
 * Wrapper for axios.
 *
 * @see   {@link https://vueuse.org/useAxios}
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

  const response = ref<any>(null) as Ref<AxiosResponse<T> | undefined>
  const data = ref<any>(undefined) as Ref<T | undefined>
  const finished = ref(false)
  const canceled = ref(false)
  const error = ref<AxiosError<T> | undefined>()

  const cancelToken: CancelTokenSource = axios.CancelToken.source()
  const cancel = (message?: string) => {
    cancelToken.cancel(message)
    canceled.value = true
  }

  instance(url, { ...config, cancelToken: cancelToken.token })
    .then((r: AxiosResponse<T>) => {
      response.value = r
      data.value = r.data
      finished.value = true
    })
    .catch((e) => {
      error.value = e
      finished.value = true
    })

  return {
    response,
    data,
    error,
    finished,
    cancel,
    canceled,
  }
}
