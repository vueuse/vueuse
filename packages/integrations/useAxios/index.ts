import type { Ref, ShallowRef } from 'vue-demi'

// eslint-disable-next-line no-restricted-imports
import { computed, ref, shallowRef, unref, watch } from 'vue-demi'
import { noop, until } from '@vueuse/shared'
import type { MaybeRef } from '@vueuse/shared'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios'
import axios, { AxiosError } from 'axios'

export interface UseAxiosReturn<T, R = AxiosResponse<T>, _D = any> {
  /**
   * Axios Response
   */
  response: ShallowRef<R | undefined>

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
export interface StrictUseAxiosReturn<T, R, D> extends UseAxiosReturn<T, R, D> {
  /**
   * Manually call the axios request
   */
  execute: (url?: string | AxiosRequestConfig<D>, config?: AxiosRequestConfig<D>) => Promise<StrictUseAxiosReturn<T, R, D>>
}
export interface EasyUseAxiosReturn<T, R, D> extends UseAxiosReturn<T, R, D> {
  /**
   * Manually call the axios request
   */
  execute: (url: string, config?: AxiosRequestConfig<D>) => Promise<EasyUseAxiosReturn<T, R, D>>
}
export interface UseAxiosOptions<T = any> {
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
   * Callback when error is caught.
   */
  onError?: (e: unknown) => void

  /**
   * Callback when success is caught.
   */
  onSuccess?: (data: T) => void

  /**
   * Initial data to use
   */
  initialData?: T

  /**
   * Sets the state to initialState before executing the promise.
   */
  resetOnExecute?: boolean

  /**
   * Callback when request is finished.
   */
  onFinish?: () => void
}
type OverallUseAxiosReturn<T, R, D> = StrictUseAxiosReturn<T, R, D> | EasyUseAxiosReturn<T, R, D>

// Since AxiosInstance can be a function, MaybeRefOrGetter can't be used, since Vue will assume its a getter function and call it with toValue/toRef
// But we also can't assume that an overload parameter isn't a function, so MaybeRefOrGetter<string> subsequently can't be used
export function useAxios<T = any, R = AxiosResponse<T>, D = any>(url: MaybeRef<string>, config?: MaybeRef<AxiosRequestConfig<D>>, options?: MaybeRef<UseAxiosOptions>): StrictUseAxiosReturn<T, R, D> & Promise<StrictUseAxiosReturn<T, R, D>>
export function useAxios<T = any, R = AxiosResponse<T>, D = any>(url: MaybeRef<string>, instance?: MaybeRef<AxiosInstance>, options?: MaybeRef<UseAxiosOptions>): StrictUseAxiosReturn<T, R, D> & Promise<StrictUseAxiosReturn<T, R, D>>
export function useAxios<T = any, R = AxiosResponse<T>, D = any>(url: MaybeRef<string>, config: MaybeRef<AxiosRequestConfig<D>>, instance: MaybeRef<AxiosInstance>, options?: MaybeRef<UseAxiosOptions>): StrictUseAxiosReturn<T, R, D> & Promise<StrictUseAxiosReturn<T, R, D>>
export function useAxios<T = any, R = AxiosResponse<T>, D = any>(config?: MaybeRef<AxiosRequestConfig<D>>): EasyUseAxiosReturn<T, R, D> & Promise<EasyUseAxiosReturn<T, R, D>>
export function useAxios<T = any, R = AxiosResponse<T>, D = any>(instance?: MaybeRef<AxiosInstance>): EasyUseAxiosReturn<T, R, D> & Promise<EasyUseAxiosReturn<T, R, D>>
export function useAxios<T = any, R = AxiosResponse<T>, D = any>(config?: MaybeRef<AxiosRequestConfig<D>>, instance?: MaybeRef<AxiosInstance>): EasyUseAxiosReturn<T, R, D> & Promise<EasyUseAxiosReturn<T, R, D>>

/**
 * Wrapper for axios.
 *
 * @see https://vueuse.org/useAxios
 */
export function useAxios<T = any, R = AxiosResponse<T>, D = any>(...args: any[]): OverallUseAxiosReturn<T, R, D> & Promise<OverallUseAxiosReturn<T, R, D>> {
  const url = computed(() => {
    const val = unref(args[0])
    return typeof val === 'string' ? val : undefined
  })

  const resolvedArgs = computed(() => {
    const isAxiosInstance = (val: unknown): val is AxiosInstance => {
      return (typeof val === 'object' || typeof val === 'function') && val !== null && 'request' in val
    }

    const argsPlaceholder = unref(typeof url.value === 'string' ? 1 : 0)
    const firstValue = unref(args[0 + argsPlaceholder])
    const secondValue = unref(args[1 + argsPlaceholder])

    let defaultConfig: AxiosRequestConfig<D> = {}
    let instance: AxiosInstance = axios
    let options: UseAxiosOptions<T> = {
      immediate: !!argsPlaceholder,
      shallow: true,
    }

    if (args.length > 0 + argsPlaceholder) {
      if (isAxiosInstance(firstValue))
        instance = firstValue
      else
        defaultConfig = firstValue
    }

    if (args.length > 1 + argsPlaceholder) {
      if (isAxiosInstance(secondValue))
        instance = secondValue
    }
    if (
      (args.length === 2 + argsPlaceholder && !isAxiosInstance(secondValue))
    || args.length === 3 + argsPlaceholder
    )
      options = unref(args[args.length - 1])

    return {
      defaultConfig,
      instance,
      options: {
        ...options,
        onSuccess: options.onSuccess ?? noop,
        onError: options.onError ?? noop,
        resetOnExecute: options.resetOnExecute ?? false,
      },
    }
  })

  const response = shallowRef<AxiosResponse<T>>()
  const data = (resolvedArgs.value.options.shallow ? shallowRef : ref)<T>(resolvedArgs.value.options.initialData!) as Ref<T>
  const isFinished = ref(false)
  const isLoading = ref(false)
  const isAborted = ref(false)
  const error = shallowRef<unknown>()

  const cancelTokenSource = axios.CancelToken.source
  let cancelToken: CancelTokenSource = cancelTokenSource()

  const abort = (message?: string) => {
    if (isFinished.value || !isLoading.value)
      return

    cancelToken.cancel(message)
    cancelToken = cancelTokenSource()
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
      data.value = resolvedArgs.value.options.initialData!
  }

  const waitUntilFinished = () =>
    new Promise<OverallUseAxiosReturn<T, R, D>>((resolve, reject) => {
      until(isFinished).toBe(true)
        // eslint-disable-next-line ts/no-use-before-define
        .then(() => error.value ? reject(error.value) : resolve(result))
    })

  const promise = {
    then: (...args) => waitUntilFinished().then(...args),
    catch: (...args) => waitUntilFinished().catch(...args),
  } as Promise<OverallUseAxiosReturn<T, R, D>>

  let executeCounter = 0
  const execute: OverallUseAxiosReturn<T, R, D>['execute'] = (executeUrl: string | AxiosRequestConfig<D> | undefined = url.value, config: AxiosRequestConfig<D> = {}) => {
    error.value = undefined
    const _url = typeof executeUrl === 'string'
      ? executeUrl
      : url.value ?? config.url

    if (_url === undefined) {
      error.value = new AxiosError(AxiosError.ERR_INVALID_URL)
      isFinished.value = true
      return promise
    }
    resetData()
    abort()
    loading(true)

    executeCounter += 1
    const currentExecuteCounter = executeCounter

    resolvedArgs.value.instance(_url, { ...resolvedArgs.value.defaultConfig, ...typeof executeUrl === 'object' ? executeUrl : config, cancelToken: cancelToken.token })
      .then((r: any) => {
        if (isAborted.value)
          return
        response.value = r
        const result = r.data
        data.value = result
        resolvedArgs.value.options.onSuccess(result)
      })
      .catch((e: any) => {
        error.value = e
        resolvedArgs.value.options.onError(e)
      })
      .finally(() => {
        resolvedArgs.value.options.onFinish?.()
        if (currentExecuteCounter === executeCounter)
          loading(false)
      })
    return promise
  }

  watch(url, (newValue) => {
    if (resolvedArgs.value.options.immediate && newValue)
      (execute as StrictUseAxiosReturn<T, R, D>['execute'])()
  }, { immediate: true })

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
