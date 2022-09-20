import type { Ref, ShallowRef } from 'vue-demi'
import { ref, shallowRef } from 'vue-demi'
import { isString, until } from '@vueuse/shared'
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
  isAborted: Ref<boolean>

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
   * @deprecated use `isFinished` instead
   */
  finished: Ref<boolean>

  /**
   * isLoading alias
   * @deprecated use `isLoading` instead
   */
  loading: Ref<boolean>

  /**
   * isAborted alias
   * @deprecated use `isAborted` instead
   */
  aborted: Ref<boolean>

  /**
   * abort alias
   */
  cancel: (message?: string | undefined) => void

  /**
   * isAborted alias
   * @deprecated use `isCanceled` instead
   */
  canceled: Ref<boolean>

  /**
   * isAborted alias
   */
  isCanceled: Ref<boolean>
}
export interface StrictUseAxiosReturn<T> extends UseAxiosReturn<T> {
  /**
   * Manually call the axios request
   */
  execute: (url?: string | AxiosRequestConfig, config?: AxiosRequestConfig) => PromiseLike<StrictUseAxiosReturn<T>>
}
export interface EasyUseAxiosReturn<T> extends UseAxiosReturn<T> {
  /**
   * Manually call the axios request
   */
  execute: (url: string, config?: AxiosRequestConfig) => PromiseLike<EasyUseAxiosReturn<T>>
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
 */
export function useAxios<T = any>(...args: any[]): OverallUseAxiosReturn<T> & PromiseLike<OverallUseAxiosReturn<T>> {
  const url: string | undefined = typeof args[0] === 'string' ? args[0] : undefined
  const argsPlaceholder = isString(url) ? 1 : 0
  let defaultConfig: AxiosRequestConfig = {}
  let instance: AxiosInstance = axios
  let options: UseAxiosOptions = { immediate: !!argsPlaceholder }

  const isAxiosInstance = (val: any) => !!val?.request

  if (args.length > 0 + argsPlaceholder) {
    /**
     * Unable to use `instanceof` here because of (https://github.com/axios/axios/issues/737)
     * so instead we are checking if there is a `request` on the object to see if it is an
     * axios instance
     */
    if (isAxiosInstance(args[0 + argsPlaceholder]))
      instance = args[0 + argsPlaceholder]
    else
      defaultConfig = args[0 + argsPlaceholder]
  }

  if (args.length > 1 + argsPlaceholder) {
    if (isAxiosInstance(args[1 + argsPlaceholder]))
      instance = args[1 + argsPlaceholder]
  }
  if (
    (args.length === 2 + argsPlaceholder && !isAxiosInstance(args[1 + argsPlaceholder]))
    || args.length === 3 + argsPlaceholder
  )
    options = args[args.length - 1]

  const response = shallowRef<AxiosResponse<T>>()
  const data = shallowRef<T>()
  const isFinished = ref(false)
  const isLoading = ref(false)
  const isAborted = ref(false)
  const error = shallowRef<AxiosError<T>>()

  const cancelToken: CancelTokenSource = axios.CancelToken.source()
  const abort = (message?: string) => {
    if (isFinished.value || !isLoading.value)
      return

    cancelToken.cancel(message)
    isAborted.value = true
    isLoading.value = false
    isFinished.value = false
  }
  const loading = (loading: boolean) => {
    isLoading.value = loading
    isFinished.value = !loading
  }
  const waitUntilFinished = () =>
    new Promise<OverallUseAxiosReturn<T>>((resolve, reject) => {
      until(isFinished).toBe(true)
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        .then(() => resolve(result))
        .catch(reject)
    })
  const then: PromiseLike<OverallUseAxiosReturn<T>>['then'] = (onFulfilled, onRejected) =>
    waitUntilFinished().then(onFulfilled, onRejected)
  const execute: OverallUseAxiosReturn<T>['execute'] = (executeUrl: string | AxiosRequestConfig | undefined = url, config: AxiosRequestConfig = {}) => {
    error.value = undefined
    const _url = typeof executeUrl === 'string'
      ? executeUrl
      : url ?? ''
    loading(true)
    instance(_url, { ...defaultConfig, ...typeof executeUrl === 'object' ? executeUrl : config, cancelToken: cancelToken.token })
      .then((r: any) => {
        response.value = r
        data.value = r.data
      })
      .catch((e: any) => {
        error.value = e
      })
      .finally(() => loading(false))
    return { then }
  }
  if (options.immediate && url)
    (execute as StrictUseAxiosReturn<T>['execute'])()

  const result = {
    response,
    data,
    error,
    finished: isFinished,
    loading: isLoading,
    isFinished,
    isLoading,
    cancel: abort,
    isAborted,
    canceled: isAborted,
    aborted: isAborted,
    isCanceled: isAborted,
    abort,
    execute,
  } as OverallUseAxiosReturn<T>

  return {
    ...result,
    then,
  }
}
