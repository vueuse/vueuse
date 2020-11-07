# useAsyncState

> Reactive async state. It will not block your setup and will triggers changes once the promise is ready.

## Usage

```ts
import axios from 'axios'
import { useAsyncState } from '@vueuse/core'

const { state, ready } = useAsyncState(
  axios
    .get('https://jsonplaceholder.typicode.com/todos/1')
    .then(t => t.data),
  { id: null },
)
```
