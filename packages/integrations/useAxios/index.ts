import { Ref, ref } from 'vue-demi'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios'

/**
 * Wrapper for axios.
 *
 * @see   {@link https://vueuse.org/useAxios}
 * @param url
 * @param config
 */
export function useAxios<T = any>(
  url: string,
  config?: AxiosRequestConfig,
) {
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

  axios(url, { ...config, cancelToken: cancelToken.token })
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
