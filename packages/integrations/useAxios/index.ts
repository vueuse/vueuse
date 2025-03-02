import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'
import { containsProp, toRef, until } from '@vueuse/shared'
import axios, { AxiosError } from 'axios'
import { computed, ref as deepRef, shallowRef, toValue, watch } from 'vue'

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
   * Will automatically refetch when:
   * - the URL is changed if the URL is a ref
   * - the payload is changed if the payload is a ref
   *
   * @default false
   */
  refetch?: MaybeRefOrGetter<boolean>

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

export function useAxios<T = any, R = AxiosResponse<T>, D = any, O extends UseAxiosOptionsWithInitialData<T> = UseAxiosOptionsWithInitialData<T>>(url: MaybeRefOrGetter<string>, config?: AxiosRequestConfig<D>, options?: O): StrictUseAxiosReturn<T, R, D, O> & Promise<StrictUseAxiosReturn<T, R, D, O>>
export function useAxios<T = any, R = AxiosResponse<T>, D = any, O extends UseAxiosOptionsWithInitialData<T> = UseAxiosOptionsWithInitialData<T>>(url: MaybeRefOrGetter<string>, instance?: AxiosInstance, options?: O): StrictUseAxiosReturn<T, R, D, O> & Promise<StrictUseAxiosReturn<T, R, D, O>>
export function useAxios<T = any, R = AxiosResponse<T>, D = any, O extends UseAxiosOptionsWithInitialData<T> = UseAxiosOptionsWithInitialData<T>>(url: MaybeRefOrGetter<string>, config: AxiosRequestConfig<D>, instance: AxiosInstance, options?: O): StrictUseAxiosReturn<T, R, D, O> & Promise<StrictUseAxiosReturn<T, R, D, O>>
export function useAxios<T = any, R = AxiosResponse<T>, D = any, O extends UseAxiosOptionsBase<T> = UseAxiosOptionsBase<T>>(url: MaybeRefOrGetter<string>, config?: AxiosRequestConfig<D>, options?: O): StrictUseAxiosReturn<T, R, D, O> & Promise<StrictUseAxiosReturn<T, R, D, O>>
export function useAxios<T = any, R = AxiosResponse<T>, D = any, O extends UseAxiosOptionsBase<T> = UseAxiosOptionsBase<T>>(url: MaybeRefOrGetter<string>, instance?: AxiosInstance, options?: O): StrictUseAxiosReturn<T, R, D, O> & Promise<StrictUseAxiosReturn<T, R, D, O>>
export function useAxios<T = any, R = AxiosResponse<T>, D = any, O extends UseAxiosOptionsBase<T> = UseAxiosOptionsBase<T>>(url: MaybeRefOrGetter<string>, config: AxiosRequestConfig<D>, instance: AxiosInstance, options?: O): StrictUseAxiosReturn<T, R, D, O> & Promise<StrictUseAxiosReturn<T, R, D, O>>
export function useAxios<T = any, R = AxiosResponse<T>, D = any>(config?: AxiosRequestConfig<D>): EasyUseAxiosReturn<T, R, D> & Promise<EasyUseAxiosReturn<T, R, D>>
export function useAxios<T = any, R = AxiosResponse<T>, D = any>(instance?: AxiosInstance): EasyUseAxiosReturn<T, R, D> & Promise<EasyUseAxiosReturn<T, R, D>>
export function useAxios<T = any, R = AxiosResponse<T>, D = any>(config?: AxiosRequestConfig<D>, instance?: AxiosInstance): EasyUseAxiosReturn<T, R, D> & Promise<EasyUseAxiosReturn<T, R, D>>
// It's important that if the first argument input is a function, that it's handled in the resolvedArgs, similar to the axios instance resolution
// toValue calls the function

/**
 * Wrapper for axios.
 *
 * @see https://vueuse.org/useAxios
 */
export function useAxios<T = any, R = AxiosResponse<T>, D = any>(...args: any[]): OverallUseAxiosReturn<T, R, D> & Promise<OverallUseAxiosReturn<T, R, D>> {
  const isAxiosInstance = (val: unknown): val is AxiosInstance =>
    typeof val === 'function'
    && containsProp(val, 'request', 'get', 'post')

  const resolvedArgs = computed(() => {
    const [_firstArg, secondArg, thirdArg, fourthArg] = args as unknown[]
    const firstArg = isAxiosInstance(_firstArg) ? _firstArg : toValue(_firstArg)

    let _url: string | undefined
    let _axiosInstance: AxiosInstance = axios
    let _config: AxiosRequestConfig<D> | undefined
    let _options: UseAxiosOptions<unknown> | undefined

    if (typeof firstArg === 'string')
      _url = firstArg
    else if (isAxiosInstance(firstArg))
      _axiosInstance = firstArg
    // Axios request config is an object that can be empty. Unlike the rest, we can't use a type guard here
    // It is simply the least specific type
    else if (firstArg && typeof firstArg === 'object')
      _config = firstArg

    if (secondArg) {
      if (isAxiosInstance(secondArg))
        _axiosInstance = secondArg
      else if (typeof secondArg === 'object' && secondArg !== null)
        _config = secondArg
    }

    if (thirdArg) {
      if (isAxiosInstance(thirdArg))
        _axiosInstance = thirdArg
      else if (typeof thirdArg === 'object' && thirdArg !== null)
        _options = thirdArg
    }

    if (fourthArg)
      _options = fourthArg

    const defaultOptions: UseAxiosOptions<T> = {
      immediate: !!_url,
      shallow: true,
      abortPrevious: true,
      refetch: false,
    }

    return {
      url: _url,
      axiosInstance: _axiosInstance,
      config: _config,
      options: _options || defaultOptions,
    }
  })

  const defaultConfig: AxiosRequestConfig<D> = resolvedArgs.value.config || {}

  const initialData = (resolvedArgs.value.options as UseAxiosOptionsWithInitialData<T>).initialData
  const response = shallowRef<AxiosResponse<T>>()
  const data = (resolvedArgs.value.options.shallow ? shallowRef : deepRef)<T>(initialData!) as Ref<T>
  const isFinished = shallowRef(false)
  const isLoading = shallowRef(false)
  const isAborted = shallowRef(false)
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
    if (resolvedArgs.value.options.resetOnExecute)
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
  const execute: OverallUseAxiosReturn<T, R, D>['execute'] = (executeUrl: string | AxiosRequestConfig<D> | undefined = resolvedArgs.value.url, config: AxiosRequestConfig<D> = {}) => {
    error.value = undefined
    const _url = typeof executeUrl === 'string'
      ? executeUrl
      : resolvedArgs.value.url ?? config.url

    if (_url === undefined) {
      error.value = new AxiosError(AxiosError.ERR_INVALID_URL)
      isFinished.value = true
      return promise
    }
    resetData()

    if (resolvedArgs.value.options.abortPrevious !== false)
      abort()

    loading(true)

    executeCounter += 1
    const currentExecuteCounter = executeCounter
    isAborted.value = false

    resolvedArgs.value.axiosInstance(_url, { ...defaultConfig, ...typeof executeUrl === 'object' ? executeUrl : config, signal: abortController.signal })
      .then((r) => {
        if (isAborted.value)
          return
        response.value = r
        const result = r.data
        data.value = result
        resolvedArgs.value.options.onSuccess?.(result)
      })
      .catch((e: unknown) => {
        error.value = e
        resolvedArgs.value.options.onError?.(e)
      })
      .finally(() => {
        resolvedArgs.value.options.onFinish?.()
        if (currentExecuteCounter === executeCounter)
          loading(false)
      })
    return promise
  }

  const refetch = toRef(resolvedArgs.value.options.refetch)
  watch([
    refetch,
    () => resolvedArgs.value.url,
  ], ([newRefreshValue, newUrl]) => {
    if (newRefreshValue && newUrl) {
      execute(newUrl)
    }
  })

  if (resolvedArgs.value.options.immediate && resolvedArgs.value.url) {
    ;(execute as StrictUseAxiosReturn<T, R, D>['execute'])()
  }

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
