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
The `beforeFetch` option can intercept a request before it is sent and modify the request options and url.
```ts
const { data } = useFetch(url, {
  async beforeFetch({ url, options, cancel }) {
    const myToken = await getMyToken()

    if (!myToken)
      cancel()

    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${myToken}`,
    }

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
