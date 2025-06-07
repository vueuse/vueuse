---
category: State
---

# useAsyncState

Reactive async state. Will not block your setup function and will trigger changes once the promise is ready. The state is a `shallowRef` by default.

Also supports isomorphic destructuring via [makeDestructurable](https://vueuse.org/shared/makeDestructurable) utility.

## Usage

```ts
import { useAsyncState } from '@vueuse/core'
import axios from 'axios'

// Object destructure example
const { state, isReady, isLoading } = useAsyncState(
  axios
    .get('https://jsonplaceholder.typicode.com/todos/1')
    .then(t => t.data),
  { id: null },
)

// Array destructure example (in right order)
const [state, execute, isLoading, isReady, error] = useAsyncState(
  axios
    .get('https://jsonplaceholder.typicode.com/todos/1')
    .then(t => t.data),
  { id: null },
)
```
