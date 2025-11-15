---
category: Animation
---

# useWebWorkerIntervalFn

Wrapper for Web Worker based `setInterval` with controls

## Usage

```ts
import { useWebWorkerIntervalFn } from '@vueuse/core'

const { pause, resume } = useWebWorkerIntervalFn(() => {
  /* your function */
}, 1000)
```
