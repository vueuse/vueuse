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

  <button class="ml-2 button" @click="event => execute(500, event)">
    Execute with delay
  </button>
</template>
```

### Cancel previous promise and use latest promise

You can pass in cancellable to ensure only the latest request takes effect, and you can also cancel requests manually.

```vue
<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'

function p(num = 1) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(num)
    }, num * 100)
  })
}

const { execute, state, cancel } = useAsyncState(p, 0, { cancellable: true })

// state is 2 when cancellable is true, otherwise it's 3
function executeCancelable() {
  execute(0, 1)
  execute(0, 3)
  execute(0, 2)
}
</script>

<template>
  <p>State: {{ state }}</p>

  <button class="button" @click="executeCancelable">
    executeCancelable
  </button>

  <button class="ml-2 button" @click="cancel">
    cancel
  </button>
</template>
```
