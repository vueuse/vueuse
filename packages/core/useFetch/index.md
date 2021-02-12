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

Using normal fetch request options

```ts
import { useFetch } from '@vueuse/core'

const { execute, data } = useFetch(url,
  {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
  { immediate: false })


```

<!--FOOTER_STARTS-->
## Type Declarations

```typescript
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
   * Default: true
   */
  autoFetch?: boolean
  /**
   * Will automatically refetch when the URL is changed if the url is a ref
   * Default: false
   */
  autoRefetch?: MaybeRef<boolean>
}
export declare function useFetch(url: MaybeRef<string>): UseFetchReturn
export declare function useFetch(
  url: MaybeRef<string>,
  useFetchOptions: UseFetchOptions
): UseFetchReturn
export declare function useFetch(
  url: MaybeRef<string>,
  options: RequestInit
): UseFetchReturn
export declare function useFetch(
  url: MaybeRef<string>,
  options: RequestInit,
  useFetchOptions: UseFetchOptions
): UseFetchReturn
export {}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useFetch/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/useFetch/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useFetch/index.md)


<!--FOOTER_ENDS-->
