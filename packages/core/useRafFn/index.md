# useRafFn

> Reactive call function on each `requestAnimationFrame`.

## Usage

```jsx
import { useRafFn } from '@vueuse/core'

useRafFn((elapsed) => {
  console.log(elapsed.value)
})
```
