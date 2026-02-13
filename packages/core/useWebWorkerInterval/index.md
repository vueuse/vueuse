---
category: Animation
---

# useWebWorkerInterval

Wrapper for Web Worker based `setInterval` with controls

## Usage

```ts
import { useWebWorkerInterval } from '@vueuse/core'

const { pause, resume } = useWebWorkerInterval(() => {
  /* your function */
}, 1000)
```
