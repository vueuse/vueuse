---
category: Browser
---

# useFetch

Reactive [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) provides the ability to abort requests, intercept requests before
they are fired, automatically refetch requests when the url changes, and create your own `useFetch` with predefined options. 

[[toc]]

## Usage

### Basic Usage
The `useFetch` function can be used by simply providing a url. The url can be either a string or a `ref`. The `data`
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
**Warning**: if you have configured `responseHandler` option, `afterFetch` callback will not be called, you will need to include
the logic inside `responseHandler`.

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

The `afterFetch` option can intercept the response data before it is updated.

```ts
const { data } = useFetch(url, {
  afterFetch(ctx) {
    if (ctx.data.title === 'HxH')
      ctx.data.title = 'Hunter x Hunter' // Modifies the resposne data

    return ctx
  },
})
```

### Setting the request method and return type
The request method and return type can be set by adding the appropriate methods to the end of `useFetch`

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
The `createFetch` function will return a useFetch function with whatever pre-configured options that are provided to it.
This is useful for interacting with API's throughout an application that uses the same base URL or needs Authorization headers.
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

### Events

The `onFetchResponse` and `onFetchError` will fire on fetch request responses and errors respectively.

```ts
const { onFetchResponse, onFetchError } = useFetch(url)

onFetchResponse((response) => {
  console.log(response.status)
})

onFetchError((error) => {
  console.error(error.message)
})
```

### Handling `application/x-www-form-urlencoded`

You can `post` or `put` your data with `application/x-www-form-urlencoded` encoding, providing a `URLSearchParams`
object, or a raw object on the `payload` configuration option or `body` on `beforeFetch` callback.

**Warning**: you must configure explicitly the `payloadType` to `formEncoded`, if you omit it, then you may have 
unexpected behavior.

If you provide a raw object, `useFetch` will take care of encoding correctly.

For example, you can use `URLSearchParams`:
```ts
const { data } = useFetch('/api').post(new URLSearchParams({
  param1: 'some data &%+', 
  param2: 'some other data'
}), 'formEncoded')
```

or a raw object like this (which is equivalent to previous code):
```ts
const { data } = useFetch('/api').post({
  param1: 'some data &%+',
  param2: 'some other data'
}, 'formEncoded')
```

**Note about using raw objects:** if you have nested objects inside the payload, they will be serialized as `json` under 
its corresponding key, for example:
```ts
const payload = {
  subject: 'What vue libraries are you using?',
  library1: {
    name: '@vueuse/core',
    description: 'Collection of essential Vue Composition Utilities',
  },
  library2: {
    name: '@vueuse/router',
    description: 'Utilities for vue-router',
  }
}
```
will send `library1` and `library2` values as a string using `JSON.stringify`.

### Handling `multipart/form-data`

You can `post` or `put` your data with `multipart/form-data` encoding, providing a `FormData`
object, or a raw object on the `payload` configuration option or `body` on `beforeFetch` callback.

**Warning**: you must configure explicitly the `payloadType` to `formData`, if you omit it, then you may have
unexpected behavior.

If you provide a raw object, `useFetch` will take care of encoding correctly.

For example, you can use `FormData` (see [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/useFetch/demo.vue) to know how to upload a `File` from a form):
```ts
const file = ref<File | null>(null)
...
const { execute } = useFetch('/api', {
  immediate: false,
  beforeFetch: async() => {
    const body = new FormData()
    body.append('file', file.value, file.value.name)
    return {
      options: {
        body 
      } 
    }
  },
}).post(null, 'formData')
...
// on some button action, just call execute method
execute()
```

or a raw object like this (which is equivalent to previous code):
```ts
const file = ref<File | null>(null)
...
const { execute } = useFetch('/api', {
  immediate: false,
  beforeFetch: async() => {
    return { 
      options: { 
        body: { 
          file: file.value
        } 
      }
    }
  }
}).post(null, 'formData')
...
// on some button action, just call execute method
execute()
```

**Note about using raw objects:** if you have nested objects inside the payload, do not add any `Blob` inside. Nested 
objects inside top keys in the payload will be included as `json` under its corresponding key, for example:
```ts
const file = ref<File | null>(null)
...
const payload = {
  file: file.value,
  owner: {
    name: '@vueuse',
    description: 'Collection of essential Vue Composition Utilities'
  }
}
```
will add the `owner` entry as a `Blob` to the `FormData` with `content-type` set to `application/json` and serialized
using `JSON.stringify`.

### Advanced usage

By default, `useFetch` will handle the server's request and response for you, but there are situations where you need 
to have control of the server response. For example, if you need to access the payload when the server response is 
not `2xx` or you have a custom logic handling response status codes.

To work around this situation, you can configure the `responseHandler` option in the configuration options, so that the 
response handling is under your control. Note that you will have to take care of extracting the payload from the server 
response.

When an error occurs, you will have to extract the payload when appropriate, configuring in the context of the response 
that an error has occurred using its error field. This way `useFetch` will propagate the error.

Advanced example for `multipart/form-data` handling status codes and disparate `payload` on error:
```ts
const file = ref<File | null>(null)
...
const { execute } = useFetch('/api', {
  immediate: false,
  beforeFetch: async() => {
    return { 
      options: { 
        body: { 
          file: file.value
        }
      }
    }
  },
  responseHandler: async(response) => {
    const context: CustomResponseContext = {
      data: null,
      error: false,
      errorMessage: undefined
    }
    switch(response.status) {
      case 200:
      case 201:
        // the server response is a file download
        // for example a pkcs#7 signature of the file uploaded
        context.data = await response.blob()
        break
      case 401:
        context.error = true
        context.errorMessage = 'Your session has expired, please login into the app'
        break
      case 403:
        context.error = true
        context.errorMessage = 'You have no permission to upload files!!!'
        break
      case 404:
        context.error = true
        context.errorMessage = 'The request is missing from server!!!'
        break
      case 413:
        // the server response is a json payload  
        context.data = await response.json()
        context.error = true
        context.errorMessage = 'Upps, something was wrong!!!'
        break
      case 500:
      default:
        context.error = true
        context.errorMessage = 'Upps, there was an internal server error!!!'
        break
    }
    return context
  },
}).post(null, 'formData')
...
// on some button action, just call execute method
execute()
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
export interface CustomResponseContext<T = any> {
  data: T | null
  error: boolean
  errorMessage?: string | undefined
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
  /**
   * Will run immediately after the fetch request is returned.
   * Runs after any 2xx response
   */
  afterFetch?: (
    ctx: AfterFetchContext
  ) => Promise<Partial<AfterFetchContext>> | Partial<AfterFetchContext>
  /**
   * Will run immediately after the fetch request is fetched.
   * If provided, then it must extract the payload from the response and deal with the errors.
   * @param response The response from `fetch`.
   */
  responseHandler?: (response: Response) => Promise<CustomResponseContext>
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
