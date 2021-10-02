---
category: Utilities
---

# loadify

Convert a `Promise` or an async `Function` by binding it's ready state to a ref.
Useful when you want to bind the loading state of multiple promises to a ref.

::: tip
Make sure you're using the right tool for the job. Using [`useAyncState`](/core/useAsyncState/)
might be more pertinent in some cases where you only want to bind the loading state of a single function 
or when you want to bind the loading states of multiple async functions individually.
:::

## Usage

```ts
import axios from 'axios'
import { loadify } from '@vueuse/core'
import { ref } from 'vue-demi'

const api = axios.create({baseUrl: 'https://httpbin.org'})
const isLoading = ref(false)

const fetch =   loadify(isLoading, id => api.get(`/anything/${id}`).then(res => res.data))
const put =     loadify(isLoading, id => api.put(`/anything/${id}`, state.value))
const remove =  loadify(isLoading, id => api.delete(`/anything/${id}`))

const state = ref({})
state.value = await fetch(42)
```

## Related Functions

- `useAsyncState`
