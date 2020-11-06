# useRafFn

> Call function on every `requestAnimationFrame`.

## Usage

```js
import { useRafFn } from '@vueuse/core'

useRafFn((elapsed) => {
  console.log(elapsed.value)
})
```
