import { Ref, ref, unref, watch, computed, ComputedRef, shallowRef } from 'vue-demi'
import { Fn, MaybeRef, containsProp } from '@vueuse/shared/utils'

interface UseFetchReturnBase<T> {
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
  data: Ref<T | null>

  /**
   * Indicates if the request is currently being fetched.
   */
  isFetching: Ref<boolean>

  /**
   * Indicates if the fetch request is able to be aborted
   */
  canAbort: ComputedRef<boolean>

  /**
   * Indicates if the fetch request was aborted
   */
  aborted: Ref<boolean>

  /**
   * Abort the fetch request
   */
  abort: Fn

  /**
   * Manually call the fetch
   */
  execute: () => Promise<any>
}

type DataType = 'text' | 'json' | 'blob' | 'arrayBuffer' | 'formData'
type PayloadType = 'text' | 'json' | 'formData'

interface UseFetchReturnMethodConfigured<T> extends UseFetchReturnBase<T> {
  // type
  json<JSON = any>(): UseFetchReturnBase<JSON>
  text(): UseFetchReturnBase<string>
  blob(): UseFetchReturnBase<Blob>
  arrayBuffer(): UseFetchReturnBase<ArrayBuffer>
  formData(): UseFetchReturnBase<FormData>
}

export interface UseFetchReturn<T> extends UseFetchReturnMethodConfigured<T> {
  // methods
  get(): UseFetchReturnMethodConfigured<T>
  post(payload?: unknown, type?: PayloadType): UseFetchReturnMethodConfigured<T>
  put(payload?: unknown, type?: PayloadType): UseFetchReturnMethodConfigured<T>
  delete(payload?: unknown, type?: PayloadType): UseFetchReturnMethodConfigured<T>
}

export interface UseFetchOptions {
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

export interface CreateFetchOptions {
  /**
   * The base URL that will be prefixed to all urls
   */
  baseUrl?: MaybeRef<string>

  /**
   * Default Options for the useFetch function
   */
  options?: UseFetchOptions

  /**
   * Options for the fetch request
   */
  fetchOptions?: RequestInit
}

/**
 * !!!IMPORTANT!!!
 *
 * If you update the UseFetchOptions interface, be sure to update this object
 * to include the new options
 */
function isFetchOptions(obj: object): obj is UseFetchOptions {
  return containsProp(obj, 'immediate', 'refetch')
}

export function createFetch(config: CreateFetchOptions = {}) {
  let options = config.options || {}
  let fetchOptions = config.fetchOptions || {}

  function useFactoryFetch(url: MaybeRef<string>, ...args: any[]) {
    const computedUrl = computed(() => config.baseUrl
      ? joinPaths(unref(config.baseUrl), unref(url))
      : unref(url),
    )

    // Merge properties into a single object
    if (args.length > 0) {
      if (isFetchOptions(args[0])) {
        options = { ...options, ...args[0] }
      }
      else {
        fetchOptions = {
          ...fetchOptions,
          ...args[0],
          headers: {
            ...(fetchOptions.headers || {}),
            ...(args[0].headers || {}),
          },
        }
      }
    }

    if (args.length > 1 && isFetchOptions(args[1]))
      options = { ...options, ...args[1] }

    return useFetch(computedUrl, fetchOptions, options)
  }

  return useFactoryFetch as typeof useFetch
}

export function useFetch<T>(url: MaybeRef<string>): UseFetchReturn<T>
export function useFetch<T>(url: MaybeRef<string>, useFetchOptions: UseFetchOptions): UseFetchReturn<T>
export function useFetch<T>(url: MaybeRef<string>, options: RequestInit, useFetchOptions?: UseFetchOptions): UseFetchReturn<T>

export function useFetch<T>(url: MaybeRef<string>, ...args: any[]): UseFetchReturn<T> {
  const supportsAbort = typeof AbortController === 'function'

  let fetchOptions: RequestInit = {}
  let options: UseFetchOptions = { immediate: true, refetch: false }
  const config = {
    method: 'get',
    type: 'text' as DataType,
    payload: undefined as unknown,
    payloadType: 'json' as PayloadType,
  }
  let initialized = false

  if (args.length > 0) {
    if (isFetchOptions(args[0]))
      options = { ...options, ...args[0] }
    else
      fetchOptions = args[0]
  }

  if (args.length > 1) {
    if (isFetchOptions(args[1]))
      options = { ...options, ...args[1] }
  }

  const isFinished = ref(false)
  const isFetching = ref(false)
  const aborted = ref(false)
  const statusCode = ref<number | null>(null)
  const response = shallowRef<Response | null>(null)
  const error = ref<any>(null)
  const data = shallowRef<T | null>(null)

  const canAbort = computed(() => supportsAbort && isFetching.value)

  let controller: AbortController | undefined

  const abort = () => {
    if (supportsAbort && controller) {
      aborted.value = true
      controller.abort()
    }
  }

  const execute = () => {
    initialized = true
    isFetching.value = true
    isFinished.value = false
    error.value = null
    statusCode.value = null
    aborted.value = false
    controller = undefined

    if (supportsAbort) {
      controller = new AbortController()
      fetchOptions = {
        signal: controller.signal,
        ...fetchOptions,
      }
    }

    const defaultFetchOptions: RequestInit = {
      method: config.method,
      headers: {},
    }

    if (config.payload) {
      const headers = defaultFetchOptions.headers as Record<string, string>
      if (config.payloadType === 'json') {
        defaultFetchOptions.body = JSON.stringify(config.payload)
        headers['Content-Type'] = 'application/json'
      }
      else {
        defaultFetchOptions.body = config.payload as any
        headers['Content-Type'] = config.payloadType === 'formData'
          ? 'multipart/form-data'
          : 'text/plain'
      }
    }

    return new Promise((resolve) => {
      fetch(
        unref(url),
        {
          ...defaultFetchOptions,
          ...fetchOptions,
          headers: {
            ...defaultFetchOptions.headers,
            ...fetchOptions?.headers,
          },
        },
      )
        .then(async(fetchResponse) => {
          response.value = fetchResponse
          statusCode.value = fetchResponse.status

          await fetchResponse[config.type]().then(text => data.value = text as any)

          // see: https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
          if (!fetchResponse.ok)
            throw new Error(fetchResponse.statusText)

          resolve(fetchResponse)
        })
        .catch((fetchError) => {
          error.value = fetchError.message || fetchError.name
        })
        .finally(() => {
          isFinished.value = true
          isFetching.value = false
        })
    })
  }

  watch(
    () => [
      unref(url),
      unref(options.refetch),
    ],
    () => unref(options.refetch) && execute(),
    { deep: true },
  )

  const base: UseFetchReturnBase<T> = {
    isFinished,
    statusCode,
    response,
    error,
    data,
    isFetching,
    canAbort,
    aborted,
    abort,
    execute,
  }

  const setMethod = (method: string) => (payload?: unknown, payloadType?: PayloadType) => {
    if (!initialized) {
      config.method = method
      config.payload = payload
      config.payloadType = payloadType || typeof payload === 'string' ? 'text' : 'json'
      return shell as any
    }
    return undefined
  }

  const setType = (type: DataType) => () => {
    if (!initialized) {
      config.type = type
      return base as any
    }
    return undefined
  }

  const shell: UseFetchReturn<T> = {
    ...base,

    get: setMethod('get'),
    put: setMethod('put'),
    post: setMethod('post'),
    delete: setMethod('delete'),

    json: setType('json'),
    text: setType('text'),
    blob: setType('blob'),
    arrayBuffer: setType('arrayBuffer'),
    formData: setType('formData'),
  }

  if (options.immediate)
    setTimeout(execute, 0)

  return shell
}

function joinPaths(start: string, end: string): string {
  if (!start.endsWith('/') && !end.startsWith('/'))
    return `${start}/${end}`

  return `${start}${end}`
}
