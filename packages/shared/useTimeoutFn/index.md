# useTimeoutFn

> Wrapper for `setTimeout` with controls.

```js
import { useTimeoutFn } from '@vueuse/core'

const { isActive, start, stop } = useTimeoutFn(() => {
  /* ... */
}, 3000)
```
