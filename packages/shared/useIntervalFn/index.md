# useIntervalFn

> Wrapper for `setInterval` with controls

## Usage

```js
import { useIntervalFn } from '@vueuse/core'

const { start, stop } = useIntervalFn(() => {
  /* your function */
}, 1000)
```
