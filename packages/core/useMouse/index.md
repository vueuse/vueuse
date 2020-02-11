# useMouse

> Reactive mouse position

## Basic Usage

```jsx
import { useMouse } from '@vueuse/core'

export default {
  setup() {
    const { x, y } = useMouse()

    return { x, y }
  },
}
```
