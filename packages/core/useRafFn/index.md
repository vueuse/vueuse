# useRafFn

> Call function on every `requestAnimationFrame`.

## Usage

```jsx
import { useRafFn } from '@vueuse/core'

useRafFn((elapsed) => {
  console.log(elapsed.value)
})
```
