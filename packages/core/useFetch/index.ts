import { Ref, ref, unref, watch, isRef, computed, ComputedRef } from 'vue-demi'
import { Fn, MaybeRef } from '@vueuse/shared'

interface UseFetchReturn {
  /**
   * Indicates if the fetch request has finished
   */
  isFinished: Ref<boolean>

  /**
   * The statusCode of the HTTP fetch response
   */
  statusCode: Ref<number | null>

  /**
   * The raw response of the fetch response
   */
  response: Ref<Response | null>

  /**
   * Any fetch errors that may have occured
   */
  error: Ref<any>

  /**
   * The fetch response body, may either be JSON or text
   */
  data: Ref<object | string | null>

  /**
   * Indicates if the request is currently being fetched.
   */
  isFetching: Ref<boolean>

  /**
   * Indicates if the fetch request is able to be aborted
   */
  canAbort: ComputedRef<boolean>

  /**
   * Abort the fetch request
   */
  abort: Fn

  /**
   * Manually call the fetch
   */
  execute: Fn
}

interface UseFetchOptions {
  /**
   * Will automatically run fetch when `useFetch` is used
   *
   * @default true
   */
  immediate?: boolean

  /**
   * Will automatically refetch when the URL is changed if the url is a ref
   *
   * @default false
   */
  refetch?: MaybeRef<boolean>
}

export function useFetch(url: MaybeRef<string>): UseFetchReturn
export function useFetch(url: MaybeRef<string>, useFetchOptions: UseFetchOptions): UseFetchReturn
export function useFetch(url: MaybeRef<string>, options: RequestInit, useFetchOptions?: UseFetchOptions): UseFetchReturn

export function useFetch(url: MaybeRef<string>, ...args: any[]): UseFetchReturn {
  const supportsAbort = typeof AbortController === 'function'

  let fetchOptions: RequestInit = {}
  let options: UseFetchOptions = { immediate: true, refetch: false }

  if (args.length > 0) {
    if ('immediate' in args[0] || 'refetch' in args[0])
      options = { ...options, ...args[0] }
    else
      fetchOptions = args[0]
  }

  if (args.length > 1) {
    if ('immediate' in args[1] || 'refetch' in args[1])
      options = { ...options, ...args[1] }
  }

  const isFinished = ref(false)
  const isFetching = ref(false)
  const statusCode = ref<number | null>(null)
  const response = ref<Response | null>(null)
  const error = ref<any>(null)
  const data = ref<string | object | null>(null)

  const canAbort = computed(() => {
    return supportsAbort && isFetching.value
  })

  let controller: AbortController | undefined

  const abort = () => {
    if (supportsAbort && controller)
      controller.abort()
  }

  const execute = () => {
    isFetching.value = true
    isFinished.value = false
    error.value = null
    statusCode.value = null
    controller = undefined

    if (supportsAbort) {
      controller = new AbortController()
      fetchOptions = { ...fetchOptions, signal: controller.signal }
    }

    fetch(unref(url), fetchOptions)
      .then((fetchResponse) => {
        response.value = fetchResponse
        statusCode.value = fetchResponse.status

        const contentType = fetchResponse.headers.get('content-type')

        if (contentType && contentType.includes('application/json'))
          fetchResponse.json().then(json => data.value = json)
        else
          fetchResponse.text().then(text => data.value = text)

        // see: https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
        if (!fetchResponse.ok)
          throw new Error(fetchResponse.statusText)
      })
      .catch(fetchError => error.value = fetchError.message)
      .finally(() => {
        isFinished.value = true
        isFetching.value = false
      })
  }

  watch(() => {
    unref(url)
    unref(options.refetch)
  }, () => unref(options.refetch) && execute(), { deep: true })

  if (options.immediate)
    execute()

  return {
    isFinished,
    statusCode,
    response,
    error,
    data,
    isFetching,
    canAbort,
    abort,
    execute,
  }
}

/**
 * Not sure about this yet, still need more feedback. But this would provide a basic
 * wrapper for making post requets using the useFetch function
 */
export function usePostJson(url: string, json: object, options: RequestInit = {}) {
  return useFetch(url, {
    method: 'POST',
    body: JSON.stringify(json),
    ...options,
    headers: {
      ...('headers' in options ? options.headers : {}),
      'Content-Type': 'application/json',
    },
  }, {
    immediate: false,
  })
}
