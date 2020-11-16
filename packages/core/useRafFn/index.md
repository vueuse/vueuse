# useRafFn

> Call function on every `requestAnimationFrame`. With controls of pausing and resuming.

## Usage

```js
import { useRafFn } from '@vueuse/core'

const { pause, resume } = useRafFn((elapsed) => {
  console.log(elapsed.value)
})
```
