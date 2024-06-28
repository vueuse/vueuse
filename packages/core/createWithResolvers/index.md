---
category: Utilities
---

# createWithResolvers

Convenient for executing `Promise` resolution and rejection functions in different scopes

::: tip
This method is equivalent to [Promise.withResolvers()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers) but it has stronger compatibility
:::

## Usage

```ts
import { ref } from 'vue'
import { createWithResolvers } from '@vueuse/core'

const { promise, resolve, reject } = createWithResolvers

promise
  .then((res) => {
    console.log(res) // resolved
  })
  .catch((err) => {
    console.log(err) // rejected
  })

Promise.race([
  setTimeout(() => resolve('resolved'), Math.ceil(Math.random() * 1000)),
  setTimeout(() => reject('rejected'), Math.ceil(Math.random() * 1000)),
])
```
