---
category: Utilities
---

# createWithResolvers

Compatible with the latest Promise.withResolvers() static method.

Convenience resolve and reject functions are now in the same scope as the Promise itself, rather than being created and used once in the executor.

## Usage

```ts
import { ref } from 'vue'
import { createWithResolvers } from '@vueuse/core'

const { promise, resolve, reject } = createWithResolvers

const msg = ref('pending')

promise.then((res) => {
  console.log(res) // resolved
})

setTimeout(() => {
  resolve('resolved')
}, 1000)
```
