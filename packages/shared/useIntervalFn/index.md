---
category: Animation
---

# useIntervalFn

Wrapper for `setInterval` with controls

## Usage

```js
import { useIntervalFn } from '@vueuse/core'

const { pause, resume, isActive } = useIntervalFn(() => {
  /* your function */
}, 1000)
```
