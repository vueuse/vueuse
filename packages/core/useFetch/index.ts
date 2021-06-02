import { Ref, ref, unref, watch, computed, ComputedRef, shallowRef } from 'vue-demi'
import { Fn, MaybeRef, containsProp, createEventHook, EventHookOn } from '@vueuse/shared'
import { defaultWindow } from '../_configurable'

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
   */
  execute: () => Promise<any>

  /**
   * Fires after the fetch request has finished
   */
  onFetchResponse: EventHookOn<Response>

  /**
   * Fires after a fetch request error
   */
  onFetchError: EventHookOn
}

type DataType = 'text' | 'json' | 'blob' | 'arrayBuffer' | 'formData'
type PayloadType = 'text' | 'json' | 'formEncoded' | 'formData'

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

const wwwFormEncodedRegEx = [/\r?\n/g, /%20/g]

async function encodeFormUrlPiece(str?: string): Promise<string> {
  // Spec says to normalize newlines to \r\n and replace %20 spaces with +.
  // jQuery does this as well, so this is likely to be widely compatible.
  if (str) {
    return encodeURIComponent(str.replace(wwwFormEncodedRegEx[0], '\r\n')).replace(
      wwwFormEncodedRegEx[1],
      '+',
    )
  }

  return ''
}

async function encodeFormUrlObject(body: any): Promise<string> {
  if (body) {
    const pieces = await Promise.all(Object.keys(body).map(async(key) => {
      return `${await encodeFormUrlPiece(key)}=${await encodeFormUrlPiece(
        Object.prototype.hasOwnProperty.call(body, key) ? body[key] : null,
      )}`
    }))
    return pieces.join('&')
  }
  return ''
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

  const {
    fetch = defaultWindow?.fetch,
  } = options

  // Event Hooks
  const responseEvent = createEventHook<Response>()
  const errorEvent = createEventHook<any>()

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

  const execute = async() => {
    initialized = true
    isFetching.value = true
    isFinished.value = false
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

    let isCanceled = false
    const context: BeforeFetchContext = { url: unref(url), options: fetchOptions, cancel: () => { isCanceled = true } }

    if (options.beforeFetch)
      Object.assign(context, await options.beforeFetch(context))

    if (isCanceled || !fetch)
      return Promise.resolve()

    const defaultFetchOptions: RequestInit = {
      method: config.method,
      headers: {},
    }

    let payload = context.options?.body || config.payload

    if (payload) {
      const headers = defaultFetchOptions.headers as Record<string, string>
      if (config.payloadType === 'json') {
        payload = JSON.stringify(payload)
        headers['Content-Type'] = 'application/json'
      }
      else {
        if (config.payloadType === 'formData' || payload instanceof FormData) {
          // we just add it here to remove later once merged with context.options.headers
          headers['Content-Type'] = 'multipart/form-data'
        }
        else if (config.payloadType === 'text') {
          headers['Content-Type'] = 'text/plain'
        }
        else {
          headers['Content-Type'] = 'application/x-www-form-urlencoded'
          // if the payload is not URLSearchParams nor a string, we need to encode it
          // if it is a string it should be already encoded: avoiding double encoding
          if (!(payload instanceof URLSearchParams) && typeof payload !== 'string')
            payload = await encodeFormUrlObject(payload)
        }
      }
    }

    const useHeaders = new Headers(defaultFetchOptions.headers)
    const contextHeaders = context.options?.headers ? new Headers(context.options.headers) : null
    if (contextHeaders) {
      // just override existing or add context ones
      contextHeaders.forEach((hv, h) => {
        useHeaders.set(h, hv)
      })
    }
    // since we are using Headers object, it will find content-type header (key lookup is case-insensitive)
    if (useHeaders.get('Content-Type') === 'multipart/form-data')
      useHeaders.delete('Content-Type')

    return new Promise((resolve) => {
      // defaultFetchOptions headers was used in the above logic
      const { method } = defaultFetchOptions
      // headers and body was merged on above logic, and so will be ignored here
      const { headers, body, ...contextOptions } = context?.options || {}
      fetch(
        context.url,
        {
          method,
          body: payload as any,
          headers: useHeaders,
          ...contextOptions,
        },
      )
        .then(async(fetchResponse) => {
          response.value = fetchResponse
          statusCode.value = fetchResponse.status

          let responseData = await fetchResponse[config.type]()

          // see: https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
          if (!fetchResponse.ok)
            throw new Error(fetchResponse.statusText)

          if (options.afterFetch)
            ({ data: responseData } = await options.afterFetch({ data: responseData, response: fetchResponse }))

          data.value = responseData as any
          responseEvent.trigger(fetchResponse)
          resolve(fetchResponse)
        })
        .catch((fetchError) => {
          error.value = fetchError.message || fetchError.name
          errorEvent.trigger(fetchError)
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

    onFetchResponse: responseEvent.on,
    onFetchError: errorEvent.on,
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

  function setMethod(method: string) {
    return (payload?: unknown, payloadType?: PayloadType) => {
      if (!initialized || !config.payloadType || (config.payloadType === payloadType)) {
        config.method = method
        config.payload = payload
        if (payloadType)
          config.payloadType = payloadType

        else if (payload instanceof FormData)
          config.payloadType = 'formData'

        else if (payload instanceof URLSearchParams)
          config.payload = 'formEncoded'

        else
          config.payloadType = typeof payload === 'string' ? 'text' : 'json'

        return shell as any
      }
      return undefined
    }
  }

  function setType(type: DataType) {
    return () => {
      if (!initialized) {
        config.type = type
        return base as any
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
