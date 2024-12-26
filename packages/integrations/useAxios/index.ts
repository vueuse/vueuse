import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { Ref, ShallowRef } from 'vue'
import { noop, until } from '@vueuse/shared'
import axios, { AxiosError } from 'axios'
import { ref, shallowRef } from 'vue'

export interface UseAxiosReturn<T, R = AxiosResponse<T>, _D = any, O extends UseAxiosOptions = UseAxiosOptions<T>> {
  /**
   * Axios Response
   */
  response: ShallowRef<R | undefined>

  /**
   * Axios response data
   */
  data: O extends UseAxiosOptionsWithInitialData<T> ? Ref<T> : Ref<T | undefined>

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
  error: ShallowRef<unknown | undefined>

  /**
   * Aborts the current request
   */
  abort: (message?: string | undefined) => void

  /**
   * Alias to `abort`
   */
  cancel: (message?: string | undefined) => void

  /**
   * Alias to `isAborted`
   */
  isCanceled: Ref<boolean>
}
export interface StrictUseAxiosReturn<T, R, D, O extends UseAxiosOptions = UseAxiosOptions<T>> extends UseAxiosReturn<T, R, D, O> {
  /**
   * Manually call the axios request
   */
  execute: (url?: string | AxiosRequestConfig<D>, config?: AxiosRequestConfig<D>) => Promise<StrictUseAxiosReturn<T, R, D, O>>
}
export interface EasyUseAxiosReturn<T, R, D> extends UseAxiosReturn<T, R, D> {
  /**
   * Manually call the axios request
   */
  execute: (url: string, config?: AxiosRequestConfig<D>) => Promise<EasyUseAxiosReturn<T, R, D>>
}
export interface UseAxiosOptionsBase<T = any> {
  /**
   * Will automatically run axios request when `useAxios` is used
   *
   */
  immediate?: boolean

  /**
   * Use shallowRef.
   *
   * @default true
   */
  shallow?: boolean

  /**
   * Abort previous request when a new request is made.
   *
   * @default true
   */
  abortPrevious?: boolean

  /**
   * Callback when error is caught.
   */
  onError?: (e: unknown) => void

  /**
   * Callback when success is caught.
   */
  onSuccess?: (data: T) => void

  /**
   * Sets the state to initialState before executing the promise.
   */
  resetOnExecute?: boolean

  /**
   * Callback when request is finished.
   */
  onFinish?: () => void
}

export interface UseAxiosOptionsWithInitialData<T> extends UseAxiosOptionsBase<T> {
  /**
   * Initial data
   */
  initialData: T
}

export type UseAxiosOptions<T = any> = UseAxiosOptionsBase<T> | UseAxiosOptionsWithInitialData<T>

type OverallUseAxiosReturn<T, R, D> = StrictUseAxiosReturn<T, R, D> | EasyUseAxiosReturn<T, R, D>

export function useAxios<T = any, R = AxiosResponse<T>, D = any, O extends UseAxiosOptionsWithInitialData<T> = UseAxiosOptionsWithInitialData<T>>(url: string, config?: AxiosRequestConfig<D>, options?: O): StrictUseAxiosReturn<T, R, D, O> & Promise<StrictUseAxiosReturn<T, R, D, O>>
export function useAxios<T = any, R = AxiosResponse<T>, D = any, O extends UseAxiosOptionsWithInitialData<T> = UseAxiosOptionsWithInitialData<T>>(url: string, instance?: AxiosInstance, options?: O): StrictUseAxiosReturn<T, R, D, O> & Promise<StrictUseAxiosReturn<T, R, D, O>>
export function useAxios<T = any, R = AxiosResponse<T>, D = any, O extends UseAxiosOptionsWithInitialData<T> = UseAxiosOptionsWithInitialData<T>>(url: string, config: AxiosRequestConfig<D>, instance: AxiosInstance, options?: O): StrictUseAxiosReturn<T, R, D, O> & Promise<StrictUseAxiosReturn<T, R, D, O>>
export function useAxios<T = any, R = AxiosResponse<T>, D = any, O extends UseAxiosOptionsBase<T> = UseAxiosOptionsBase<T>>(url: string, config?: AxiosRequestConfig<D>, options?: O): StrictUseAxiosReturn<T, R, D, O> & Promise<StrictUseAxiosReturn<T, R, D, O>>
export function useAxios<T = any, R = AxiosResponse<T>, D = any, O extends UseAxiosOptionsBase<T> = UseAxiosOptionsBase<T>>(url: string, instance?: AxiosInstance, options?: O): StrictUseAxiosReturn<T, R, D, O> & Promise<StrictUseAxiosReturn<T, R, D, O>>
export function useAxios<T = any, R = AxiosResponse<T>, D = any, O extends UseAxiosOptionsBase<T> = UseAxiosOptionsBase<T>>(url: string, config: AxiosRequestConfig<D>, instance: AxiosInstance, options?: O): StrictUseAxiosReturn<T, R, D, O> & Promise<StrictUseAxiosReturn<T, R, D, O>>
export function useAxios<T = any, R = AxiosResponse<T>, D = any>(config?: AxiosRequestConfig<D>): EasyUseAxiosReturn<T, R, D> & Promise<EasyUseAxiosReturn<T, R, D>>
export function useAxios<T = any, R = AxiosResponse<T>, D = any>(instance?: AxiosInstance): EasyUseAxiosReturn<T, R, D> & Promise<EasyUseAxiosReturn<T, R, D>>
export function useAxios<T = any, R = AxiosResponse<T>, D = any>(config?: AxiosRequestConfig<D>, instance?: AxiosInstance): EasyUseAxiosReturn<T, R, D> & Promise<EasyUseAxiosReturn<T, R, D>>

/**
 * Wrapper for axios.
 *
 * @see https://vueuse.org/useAxios
 */
export function useAxios<T = any, R = AxiosResponse<T>, D = any>(...args: any[]): OverallUseAxiosReturn<T, R, D> & Promise<OverallUseAxiosReturn<T, R, D>> {
  const url: string | undefined = typeof args[0] === 'string' ? args[0] : undefined
  const argsPlaceholder = typeof url === 'string' ? 1 : 0
  const defaultOptions: UseAxiosOptions<T> = {
    immediate: !!argsPlaceholder,
    shallow: true,
    abortPrevious: true,
  }
  let defaultConfig: AxiosRequestConfig<D> = {}
  let instance: AxiosInstance = axios
  let options: UseAxiosOptions<T> = defaultOptions

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
  ) {
    options = args[args.length - 1] || defaultOptions
  }

  const {
    shallow,
    onSuccess = noop,
    onError = noop,
    immediate,
    resetOnExecute = false,
  } = options

  const initialData = (options as UseAxiosOptionsWithInitialData<T>).initialData
  const response = shallowRef<AxiosResponse<T>>()
  const data = (shallow ? shallowRef : ref)<T>(initialData!) as Ref<T>
  const isFinished = ref(false)
  const isLoading = ref(false)
  const isAborted = ref(false)
  const error = shallowRef<unknown>()

  let abortController: AbortController = new AbortController()

  const abort = (message?: string) => {
    if (isFinished.value || !isLoading.value)
      return

    abortController.abort(message)
    abortController = new AbortController()
    isAborted.value = true
    isLoading.value = false
    isFinished.value = false
  }

  const loading = (loading: boolean) => {
    isLoading.value = loading
    isFinished.value = !loading
  }

  /**
   * Reset data to initialData
   */
  const resetData = () => {
    if (resetOnExecute)
      data.value = initialData!
  }

  const waitUntilFinished = () =>
    new Promise<OverallUseAxiosReturn<T, R, D>>((resolve, reject) => {
      until(isFinished).toBe(true).then(() => error.value
        ? reject(error.value)
        // eslint-disable-next-line ts/no-use-before-define
        : resolve(result))
    })

  const promise = {
    then: (...args) => waitUntilFinished().then(...args),
    catch: (...args) => waitUntilFinished().catch(...args),
  } as Promise<OverallUseAxiosReturn<T, R, D>>

  let executeCounter = 0
  const execute: OverallUseAxiosReturn<T, R, D>['execute'] = (executeUrl: string | AxiosRequestConfig<D> | undefined = url, config: AxiosRequestConfig<D> = {}) => {
    error.value = undefined
    const _url = typeof executeUrl === 'string'
      ? executeUrl
      : url ?? config.url

    if (_url === undefined) {
      error.value = new AxiosError(AxiosError.ERR_INVALID_URL)
      isFinished.value = true
      return promise
    }
    resetData()

    if (options.abortPrevious !== false)
      abort()

    loading(true)

    executeCounter += 1
    const currentExecuteCounter = executeCounter
    isAborted.value = false

    instance(_url, { ...defaultConfig, ...typeof executeUrl === 'object' ? executeUrl : config, signal: abortController.signal })
      .then((r: any) => {
        if (isAborted.value)
          return
        response.value = r
        const result = r.data
        data.value = result
        onSuccess(result)
      })
      .catch((e: any) => {
        error.value = e
        onError(e)
      })
      .finally(() => {
        options.onFinish?.()
        if (currentExecuteCounter === executeCounter)
          loading(false)
      })
    return promise
  }

  if (immediate && url)
    (execute as StrictUseAxiosReturn<T, R, D>['execute'])()

  const result = {
    response,
    data,
    error,
    isFinished,
    isLoading,
    cancel: abort,
    isAborted,
    isCanceled: isAborted,
    abort,
    execute,
  } as OverallUseAxiosReturn<T, R, D>

  return {
    ...result,
    ...promise,
  }
}
