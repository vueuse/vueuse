# useIntervalFn

> Simple wrapper for `setInterval`.

## Usage

```js
import { useIntervalFn } from '@vueuse/core'

const { start, stop } = useIntervalFn(() => {
  /* your function */
}, 1000)
```
