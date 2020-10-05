# useIdle

> Tracks whether the user is being inactive

## Usage

```jsx
import { useIdle } from '@vueuse/core'

export default {
  setup() {
    const { idle, lastActive } = useIdle(5 * 60 * 1000) // 5 min timer

    return { idle }
  },
}
```
