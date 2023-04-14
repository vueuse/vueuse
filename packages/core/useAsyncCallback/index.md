---
category: Utilities
---

# useAsyncCallback

Provide reactive data regarding the state of asynchronous functions and return a new function with the same functionality.

## Usage

```html
<template>
  {{ loading && 'loading...' }}
  {{ error && error.message }}
</template>

<script setup>
import { useAsyncCallback } from '@vueuse/core'

const [execute, loading, error] = useAsyncCallback(async (ids: string[]) => {
  // ...
})

execute([0, 3, 1])
</script>
```

### Use with object destructuring

```ts
const { execute, loading, error } = useAsyncCallback(async () => {
  // ...
})
```
