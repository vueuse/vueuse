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

### Manually trigger the async function

You can also trigger it manually. This is useful when you want to control when the async function is executed.

```vue
<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'

const { state, execute, executeImmediate } = useAsyncState(action, '', { immediate: false })

async function action(event) {
  await new Promise(resolve => setTimeout(resolve, 500))
  return `${event.target.textContent} clicked!`
}
</script>

<template>
  <p>State: {{ state }}</p>

  <button class="button" @click="executeImmediate">
    Execute now
  </button>

  <button class="ml-2 button" @click="event => execute(500, event.target)">
    Execute with delay
  </button>
</template>
```
