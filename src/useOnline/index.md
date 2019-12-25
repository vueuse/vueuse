# useOnline

Reactive online state. A wrapper of `useNetwork`

## Usage

```jsx
import { useOnline } from '@vueuse/core'

export default {
  setup () {
    const online = useOnline()

    return { online }
  },
}
```
