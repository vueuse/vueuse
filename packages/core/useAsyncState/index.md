# useAsyncState

> Reactive async state. It will not block your setup and will triggers changes once the promise is ready.

## Usage

```jsx
import { useAsyncState } from '@vueuse/core'
import axios from 'axios'

export default {
  setup() {
    const { state, ready } = useAsyncState(
      axios
        .get('https://jsonplaceholder.typicode.com/todos/1')
        .then(t => t.data),
      {
        id: null,
      },
    )

    return { state, ready }
  },
}
```
