---
category: State
---

# useAsyncState

Reactive async state. Will not block your setup function and will trigger changes once the promise is ready. The state is a `shallowRef` by default.

## Usage

```ts
import { useAsyncState } from '@vueuse/core'
import axios from 'axios'

const { state, isReady, isLoading } = useAsyncState(
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

const { state, execute, executeNow } = useAsyncState(logEvent, undefined, { immediate: false })

async function logEvent(event) {
  console.log('Event:', event)
  await new Promise(resolve => setTimeout(resolve, 50))
}
</script>

<template>
  <p>State: {{ state }}</p>

  <button class="button" @click="executeNow">
    Execute now
  </button>

  <button class="ml-2 button" @click="event => execute(500, event.target)">
    Execute with delay
  </button>
</template>
```
