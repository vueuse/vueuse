import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Ref, ref } from 'vue-demi'

export function useAxios<T = any>(
  url: string,
  config?: AxiosRequestConfig,
) {
  const response = ref<any>(null) as Ref<AxiosResponse<T> | undefined>
  const data = ref<any>(undefined) as Ref<T | undefined>
  const finished = ref(false)
  const error = ref<AxiosError<T> | undefined>()

  axios(url, config)
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
  }
}
