---
category: State
---

# useCancellableAsyncState

Cancellable version of `useAsyncState`

## Usage

```ts
import axios from 'axios'
import { useCancellableAsyncState } from '@vueuse/core'

const { state, isReady, isLoading } = useCancellableAsyncState(
  (onCancel) => {
    const abortController = new AbortController()

    onCancel(() => abortController.abort())

    const id = args?.id || 1
    return axios.get(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      { signal: abortController.signal },
    )
  },
  {},
)
```
