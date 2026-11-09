---
category: Animation
---

# useIntervalFn

Wrapper for `setInterval` with controls

## Usage

```ts
import { useIntervalFn } from '@vueuse/core'

const { pause, resume, isActive } = useIntervalFn(() => {
  /* your function */
}, 1000)
```

A non-positive interval suspends the timer and sets `isActive` to `false`. If the interval is reactive, the timer resumes when it becomes positive again. Calling `pause()` prevents automatic resumption until `resume()` is called.
