# useWindowSize

Reactive window size

## Usage

```jsx
import { useWindowSize } from '@vueuse/core'

export default {
  setup() {
    const { width, height } = useWindowSize()

    return { width, height }
  },
}
```
