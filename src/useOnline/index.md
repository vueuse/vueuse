# useOnline

> Reactive online state. A wrapper of [`useNetwork`](/?path=/story/sensors-usenetwork--demo-docs)

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
