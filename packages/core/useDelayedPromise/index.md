---
category: Unknown
---

# useDelayedPromise

Specify a minimum execution time for a promise.

## Usage

```ts
import { useDelayedPromise } from '@vueuse/core'

// promise resolving in 100ms
const promise = new Promise(resolve => setTimeout(resolve, 100))

// promise resolving not earlier than in 500ms
const delayedPromise = useDelayedPromise(promise, 500)
```
