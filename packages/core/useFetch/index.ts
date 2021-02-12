import { Ref, ref, unref, watch, isRef, computed, ComputedRef } from 'vue-demi'
import { Fn, MaybeRef } from '@vueuse/shared'

interface UseFetchReturn {
  /**
   * Indicates if the fetch request has finished
   */
  isFinished: Ref<boolean>

  /**
   * The status of the fetch request
   */
  status: Ref<number | null>

  /**
   * The raw response of the fetch request
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
  autoFetch?: boolean

  /**
   * Will automatically refetch when the URL is changed if the url is a ref
   *
   * @default false
   */
  autoRefetch?: MaybeRef<boolean>
}

export function useFetch(url: MaybeRef<string>): UseFetchReturn
export function useFetch(url: MaybeRef<string>, useFetchOptions: UseFetchOptions): UseFetchReturn
export function useFetch(url: MaybeRef<string>, options: RequestInit, useFetchOptions?: UseFetchOptions): UseFetchReturn

export function useFetch(url: MaybeRef<string>, ...args: any[]): UseFetchReturn {
  const supportsAbort = typeof AbortController === 'function'

  let fetchOptions: RequestInit = {}
  let options: UseFetchOptions = { autoFetch: true, autoRefetch: false }

  if (args[0]) {
    if ('autoFetch' in args[0] || 'autoRefetch' in args[0])
      options = { ...options, ...args[0] }
    else
      fetchOptions = args[0]
  }

  if (args[1]) {
    if ('autoFetch' in args[1] || 'autoRefetch' in args[1])
      options = { ...options, ...args[1] }
  }

  const isFinished = ref(false)
  const isFetching = ref(false)
  const status = ref<number | null>(null)
  const response = ref<Response | null>(null)
  const error = ref<any>(null)
  const data = ref<string | object | null>(null)

  const canAbort = computed(() => {
    return supportsAbort && isFetching.value
  })

  let controller: AbortController | null

  const abort = () => {
    if (supportsAbort && controller instanceof AbortController)
      controller.abort()
  }

  const execute = () => {
    isFetching.value = true
    isFinished.value = false
    error.value = null

    if (supportsAbort) {
      controller = new AbortController()
      fetchOptions = { ...fetchOptions, signal: controller.signal }
    }

    fetch(unref(url), fetchOptions)
      .then((fetchResponse) => {
        response.value = fetchResponse
        status.value = fetchResponse.status

        const contentType = fetchResponse.headers.get('content-type')

        if (contentType && contentType.includes('application/json'))
          fetchResponse.json().then(json => data.value = json)
        else
          fetchResponse.text().then(text => data.value = text)

        // see: https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
        if (!fetchResponse.ok)
          throw new Error(fetchResponse.statusText || 'Something went wrong!')
      })
      .catch(fetchError => error.value = fetchError.message)
      .finally(() => {
        isFinished.value = true
        isFetching.value = false
      })
  }

  if (isRef(url)) {
    if (isRef(options.autoRefetch))
      watch([options.autoRefetch, url], () => unref(options.autoRefetch) && execute())
    else if (options.autoRefetch)
      watch(url, () => execute())
  }

  if (options.autoFetch)
    execute()

  return {
    isFinished,
    status,
    response,
    error,
    data,
    isFetching,
    canAbort,
    abort,
    execute,
  }
}
