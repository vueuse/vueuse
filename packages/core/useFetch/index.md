---
category: Browser
---

# useFetch

Reactive [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) with support for [aborting requests](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort), in browsers that support it.

## Usage

```ts
import { useFetch } from '@vueuse/core'

const { isFinished, statusCode, error, data } = useFetch(url)
```

Prevent auto-calling the fetch request and do it manually instead

```ts
import { useFetch } from '@vueuse/core'

const { execute, data } = useFetch(url, { immediate: false })

execute()
```

Fetch as Blob

```ts
import { useFetch } from '@vueuse/core'

const { execute, data } = useFetch(url).blob()
```

Post a JSON

```ts
import { useFetch } from '@vueuse/core'

const { execute, data } = useFetch(url)
  .post({ message: 'Hello' })
  .json()
```

Abort a fetch

```ts
import { useFetch } from '@vueuse/core'

const { execute, data, isFetching, abort } = useFetch(url)

setTimeout(() => {
  // timeout!
  abort()
}, 1000)
```

Automatically refetch when your URL is a ref

```ts
import { useFetch } from '@vueuse/core'

const url = ref('https://httpbin.org/get')

const { data } = useFetch(url, { refetch: true })

setTimeout(() => {
  // Request will be fetched again
  url.value = 'https://httpbin.org/status/500'
}, 5000)
```

Create a custom `useFetch` instance with default values

```ts
// foo.ts
import { createFetch } from '@vueuse/core'

export const useMyFetch = createFetch({
  baseUrl: 'https://my-api.com',
  headers: {
    Authorization: 'my-token',
  }
})
```

```ts
// bar.ts
import { useMyFetch } from './foo'

// will request `https://my-api.com/posts` with token
const { data } = useFetch('/posts')
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
