import type { KyInstance, KyResponse, Options } from 'ky'
import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'
import { noop, until } from '@vueuse/shared'
import ky from 'ky'
import { ref, shallowRef, toValue } from 'vue'

export interface UseKyReturn<T = any, R = KyResponse<T>, _D = any, O extends UseKyOptions = UseKyOptions<T>> {
  /**
   * Ky Response
   */
  response: ShallowRef<R | undefined>
  /**
   * Ky response data
   */
  data: O extends UseKyOptionsWithInitialData<T> ? Ref<T> : Ref<T | undefined>
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
  error: ShallowRef<Error | undefined>
  /**
   * Aborts the current request
   */
  abort: (message?: string | undefined) => void
}

export interface UseKyOptionsBase<T = any> {
  /**
   * Will automatically run axios request when `useAxios` is used
   *
   * @default true
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

export interface UseKyOptionsWithInitialData<T> extends UseKyOptionsBase<T> {
  /**
   * Initial data
   */
  initialData: T
}

export type UseKyOptions<T = any> = UseKyOptionsBase<T> | UseKyOptionsWithInitialData<T>

// export function useKy<T>(url: MaybeRefOrGetter<string>, config?: Options): UseKyReturn<T> & PromiseLike<UseKyReturn<T>>

/**
 * Wrapper for ky.
 *
 * @see https://vueuse.org/useKy
 */
export function useKy<T = any, R = KyResponse<T>, D = any>(url: MaybeRefOrGetter<string>): UseKyReturn<T, R, D> & PromiseLike<UseKyReturn<T, R, D>> {
  const defaultOptions: UseKyOptions = {
    immediate: true,
    shallow: true,
  }
  const instance: KyInstance = ky
  const options: UseKyOptions<T> = defaultOptions

  const {
    shallow,
    onFinish = noop,
    onSuccess = noop,
    onError = noop,
    immediate,
    resetOnExecute = false,
    abortPrevious,
  } = options

  const initialData = (options as UseKyOptionsWithInitialData<T>).initialData
  const response = shallowRef<R>()
  const data = (shallow ? shallowRef : ref)<T>(initialData!) as Ref<T>
  const isFinished = ref(false)
  const isLoading = ref(false)
  const isAborted = ref(false)
  const error = shallowRef<Error>()

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
    new Promise<UseKyReturn<T, R, D>>((resolve, reject) => {
      until(isFinished).toBe(true).then(() => error.value
        ? reject(error.value)
        // eslint-disable-next-line ts/no-use-before-define
        : resolve(result))
    })

  const promise = {
    then: (...args) => waitUntilFinished().then(...args),
    catch: (...args) => waitUntilFinished().catch(...args),
  } as Promise<UseKyReturn<T, R, D>>

  let executeCounter = 0
  const execute = (executeUrl?: MaybeRefOrGetter<string>, option: Options = {}) => {
    error.value = undefined
    const _url = executeUrl ? toValue(executeUrl) : toValue(url)

    if (_url === undefined) {
      error.value = new Error('`input` must be a string, URL, or Request')
      isFinished.value = true

      // TODO: return promise
      // return promise
    }
    resetData()

    if (abortPrevious !== false)
      abort()

    loading(true)

    executeCounter += 1
    const currentExecuteCounter = executeCounter
    isAborted.value = false

    return instance(_url, {
      ...defaultOptions,
      ...option,
      signal: abortController.signal,
    })
      .json()
      .then((r: any) => {
        if (isAborted.value)
          return
        response.value = r
        data.value = r
        onSuccess(r)
      })
      .catch((e: Error) => {
        error.value = e
        onError(e)
      })
      .finally(() => {
        onFinish()
        if (currentExecuteCounter === executeCounter)
          loading(false)
      })
  }

  if (immediate && url)
    execute()

  const result: UseKyReturn<T, R, D> = {
    response,
    data,
    error,
    isFinished,
    isLoading,
    abort,
    isAborted,
  }

  return {
    ...result,
    ...promise,
  }
}
