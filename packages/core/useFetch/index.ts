import { Ref, ref, unref, watch, computed, ComputedRef, shallowRef } from 'vue-demi'
import { Fn, MaybeRef, containsProp, createEventHook, EventHookOn } from '@vueuse/shared'
import { defaultWindow } from '../_configurable'

interface UseFetchReturn<T> {
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
   * Any fetch errors that may have occurred
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
   * (default not throwing error)
   */
  execute: (throwOnFailed?: boolean) => Promise<any>

  /**
   * Fires after the fetch request has finished
   */
  onFetchResponse: EventHookOn<Response>

  /**
   * Fires after a fetch request error
   */
  onFetchError: EventHookOn

  /**
   * Fires after a fetch has completed
   */
  onFetchFinally: EventHookOn

  // methods
  get(): UseFetchReturn<T>
  post(payload?: unknown, type?: string): UseFetchReturn<T>
  put(payload?: unknown, type?: string): UseFetchReturn<T>
  delete(payload?: unknown, type?: string): UseFetchReturn<T>

  // type
  json<JSON = any>(): UseFetchReturn<JSON>
  text(): UseFetchReturn<string>
  blob(): UseFetchReturn<Blob>
  arrayBuffer(): UseFetchReturn<ArrayBuffer>
  formData(): UseFetchReturn<FormData>
}

type DataType = 'text' | 'json' | 'blob' | 'arrayBuffer' | 'formData'
type HttpMethod = 'get' | 'post' | 'put' | 'delete'

const payloadMapping: Record<string, string> = {
  json: 'application/json',
  text: 'text/plain',
  formData: 'multipart/form-data',
}

export interface BeforeFetchContext {
  /**
   * The computed url of the current request
   */
  url: string

  /**
   * The request options of the current request
   */
  options: RequestInit

  /**
   * Cancels the current request
   */
  cancel: Fn
}

export interface AfterFetchContext<T = any> {
  response: Response

  data: T | null
}

export interface UseFetchOptions {
  /**
   * Fetch function
   */
  fetch?: typeof window.fetch

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

  /**
   * Will run immediately before the fetch request is dispatched
   */
  beforeFetch?: (ctx: BeforeFetchContext) => Promise<Partial<BeforeFetchContext> | void> | Partial<BeforeFetchContext> | void

  /**
   * Will run immediately after the fetch request is returned.
   * Runs after any 2xx response
   */
  afterFetch?: (ctx: AfterFetchContext) => Promise<Partial<AfterFetchContext>> | Partial<AfterFetchContext>
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
  return containsProp(obj, 'immediate', 'refetch', 'beforeFetch', 'afterFetch')
}

function headersToObject(headers: HeadersInit | undefined) {
  if (headers instanceof Headers)
    return Object.fromEntries([...headers.entries()])

  return headers
}

export function createFetch(config: CreateFetchOptions = {}) {
  const _options = config.options || {}
  const _fetchOptions = config.fetchOptions || {}

  function useFactoryFetch(url: MaybeRef<string>, ...args: any[]) {
    const computedUrl = computed(() => config.baseUrl
      ? joinPaths(unref(config.baseUrl), unref(url))
      : unref(url),
    )

    let options = _options
    let fetchOptions = _fetchOptions

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
            ...(headersToObject(fetchOptions.headers) || {}),
            ...(headersToObject(args[0].headers) || {}),
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
  type InternalConfig = {method: HttpMethod; type: DataType; payload: unknown; payloadType?: string}
  const config: InternalConfig = {
    method: 'get',
    type: 'text' as DataType,
    payload: undefined as unknown,
  }

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

  const {
    fetch = defaultWindow?.fetch,
  } = options

  // Event Hooks
  const responseEvent = createEventHook<Response>()
  const errorEvent = createEventHook<any>()
  const finallyEvent = createEventHook<any>()

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
    if (supportsAbort && controller)
      controller.abort()
  }

  const loading = (isLoading: boolean) => {
    isFetching.value = isLoading
    isFinished.value = !isLoading
  }

  const execute = async(throwOnFailed = false) => {
    loading(true)
    error.value = null
    statusCode.value = null
    aborted.value = false
    controller = undefined

    if (supportsAbort) {
      controller = new AbortController()
      controller.signal.onabort = () => aborted.value = true
      fetchOptions = {
        ...fetchOptions,
        signal: controller.signal,
      }
    }

    const defaultFetchOptions: RequestInit = {
      method: config.method,
      headers: {},
    }

    if (config.payload) {
      const headers = headersToObject(defaultFetchOptions.headers) as Record<string, string>
      if (config.payloadType)
        headers['Content-Type'] = payloadMapping[config.payloadType] ?? config.payloadType

      defaultFetchOptions.body = config.payloadType === 'json' ? JSON.stringify(config.payload) : config.payload as BodyInit
    }

    let isCanceled = false
    const context: BeforeFetchContext = { url: unref(url), options: fetchOptions, cancel: () => { isCanceled = true } }

    if (options.beforeFetch)
      Object.assign(context, await options.beforeFetch(context))

    if (isCanceled || !fetch) {
      loading(false)
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      fetch(
        context.url,
        {
          ...defaultFetchOptions,
          ...context.options,
          headers: {
            ...headersToObject(defaultFetchOptions.headers),
            ...headersToObject(context.options?.headers),
          },
        },
      )
        .then(async(fetchResponse) => {
          response.value = fetchResponse
          statusCode.value = fetchResponse.status

          let responseData = await fetchResponse[config.type]()

          if (options.afterFetch)
            ({ data: responseData } = await options.afterFetch({ data: responseData, response: fetchResponse }))

          data.value = responseData as any

          // see: https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
          if (!fetchResponse.ok)
            throw new Error(fetchResponse.statusText)

          responseEvent.trigger(fetchResponse)
          resolve(fetchResponse)
        })
        .catch((fetchError) => {
          error.value = fetchError.message || fetchError.name
          errorEvent.trigger(fetchError)
          if (throwOnFailed)
            reject(fetchError)
          else
            resolve(undefined)
        })
        .finally(() => {
          loading(false)
          finallyEvent.trigger(null)
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

  const shell: UseFetchReturn<T> = {
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

    onFetchResponse: responseEvent.on,
    onFetchError: errorEvent.on,
    onFetchFinally: finallyEvent.on,
    // method
    get: setMethod('get'),
    put: setMethod('put'),
    post: setMethod('post'),
    delete: setMethod('delete'),
    // type
    json: setType('json'),
    text: setType('text'),
    blob: setType('blob'),
    arrayBuffer: setType('arrayBuffer'),
    formData: setType('formData'),
  }

  function setMethod(method: HttpMethod) {
    return (payload?: unknown, payloadType?: string) => {
      if (!isFetching.value) {
        config.method = method
        config.payload = payload
        config.payloadType = payloadType
        // Set the payload to json type only if it's not provided and a literal object is provided
        // The only case we can deduce the content type and `fetch` can't
        if (!payloadType && payload && Object.getPrototypeOf(payload) === Object.prototype)
          config.payloadType = 'json'

        return shell as any
      }
      return undefined
    }
  }

  function setType(type: DataType) {
    return () => {
      if (!isFetching.value) {
        config.type = type
        return shell as any
      }
      return undefined
    }
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
