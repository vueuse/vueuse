---
category: Animation
---

# useTimeoutFn

Wrapper for `setTimeout` with controls.

```js
import { useTimeoutFn } from '@vueuse/core'

const { isPending, start, stop } = useTimeoutFn(() => {
  /* ... */
}, 3000)
```
