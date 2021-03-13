---
category: Browser
---

# useFetch

Reactive [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) provides the ability to abort requests, intercept requests before
they are fired, automatically refetch requests when the url changes, and create your own `useFetch` with predefined options. 

[[toc]]

## Usage

### Basic Usage
The `useFetch` funciton can be used by simply providing a url. The url can be either a string or a `ref`. The `data`
object will contain the result of the request, the `error` object will contain any errors, and the `isFetching` object will
indicate if the request is loading.
```ts
import { useFetch } from '@vueuse/core'

const { isFetching, error, data } = useFetch(url)
```

### Refetching on URL change
Using a `ref` for the url parameter will allow the `useFetch` function to automatically trigger another
request when the url is changed.
```ts
const url = ref('https://my-api.com/user/1') 

const { data } = useFetch(url, { refetch: true })

url.value = 'https://my-api.com/user/2' // Will trigger another request
```

### Prevent request from firing immediately
Setting the `immediate` option to false will prevent the request from firing until the `execute`
function is called.
```ts
const { execute } = useFetch(url, { immediate: false })

execute()
```

### Aborting a request
A request can be aborted by using the `abort` function from the `useFetch` function. The `canAbort` property indicates
if the request can be aborted
```ts
const { abort, canAbort } = useFetch(url)

setTimeout(() => {
  if (canAbort.value)
    abort()
}, 100)
```

### Intercepting a request
The `beforeFetch` option can intercept a request before it is sent and modify the request options and url.
```ts
const { data } = useFetch(url, {
  async beforeFetch({ url, options, cancel }) {
    const myToken = await getMyToken()

    if (!myToken)
      cancel()

    options.headers.Authorization = `Bearer ${myToken}`

    return {
      options
    }
  }
})
```

### Setting the request method and return type
The requset method and return type can be set by adding the appropite methods to the end of `useFetch`

```ts
// Request will be sent with GET method and data will be parsed as JSON
const { data } = useFetch(url).get().json()

// Request will be sent with POST method and data will be parsed as text
const { data } = useFetch(url).post().text()

// Or set the method using the options

// Request will be sent with GET method and data will be parsed as blob
const { data } = useFetch(url, { method: 'GET' }, { refetch: true }).blob()
```

### Creating a custom instance
The `createFetch` function will return a useFetch function with whatever preconfigured options that are provided to it.
This is useful for interacting with API's thoughout an application that uses the same base URL or needs Authorization headers.
```ts
const useMyFetch = createFetch({ 
  baseUrl: 'https://my-api.com', 
  options: {
    async beforeFetch({ options }) {
      const myToken = await getMyToken()
      options.headers.Authorization = `Bearer ${myToken}`

      return { options }
    },
  }, 
  fetchOptions: {
    mode: 'cors',
  },
})

const { isFetching, error, data } = useMyFetch('users')
```

<!--FOOTER_STARTS-->
## Type Declarations

```typescript
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
declare type PayloadType = "text" | "json" | "formData"
interface UseFetchReturnMethodConfigured<T> extends UseFetchReturnBase<T> {
  json<JSON = any>(): UseFetchReturnBase<JSON>
  text(): UseFetchReturnBase<string>
  blob(): UseFetchReturnBase<Blob>
  arrayBuffer(): UseFetchReturnBase<ArrayBuffer>
  formData(): UseFetchReturnBase<FormData>
}
export interface UseFetchReturn<T> extends UseFetchReturnMethodConfigured<T> {
  get(): UseFetchReturnMethodConfigured<T>
  post(payload?: unknown, type?: PayloadType): UseFetchReturnMethodConfigured<T>
  put(payload?: unknown, type?: PayloadType): UseFetchReturnMethodConfigured<T>
  delete(
    payload?: unknown,
    type?: PayloadType
  ): UseFetchReturnMethodConfigured<T>
}
export interface BeforeFetchContext {
  /**
   * The computed url of the current request
   */
  url: string
  /**
   * The requset options of the current request
   */
  options: RequestInit
  /**
   * Cancels the current requset
   */
  cancel: Fn
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
  beforeFetch?: (
    ctx: BeforeFetchContext
  ) =>
    | Promise<Partial<BeforeFetchContext> | void>
    | Partial<BeforeFetchContext>
    | void
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
export declare function createFetch(
  config?: CreateFetchOptions
): typeof useFetch
export declare function useFetch<T>(url: MaybeRef<string>): UseFetchReturn<T>
export declare function useFetch<T>(
  url: MaybeRef<string>,
  useFetchOptions: UseFetchOptions
): UseFetchReturn<T>
export declare function useFetch<T>(
  url: MaybeRef<string>,
  options: RequestInit,
  useFetchOptions?: UseFetchOptions
): UseFetchReturn<T>
export {}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useFetch/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/useFetch/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useFetch/index.md)


<!--FOOTER_ENDS-->
