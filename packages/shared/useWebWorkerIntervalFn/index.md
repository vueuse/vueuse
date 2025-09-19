---
category: Animation
---

# useWebWorkerIntervalFn

Wrapper for `webworker-setInterval` with controls

## Usage

```ts
import { useWebWorkerIntervalFn } from '@vueuse/core'

const { pause, resume } = useWebWorkerIntervalFn(() => {
  /* your function */
}, 1000)
```
