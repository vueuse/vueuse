# useWindowScroll

Reactive window scroll

## Usage

```jsx
import { useWindowScroll } from '@vueuse/core'

export default {
  setup() {
    const { x, y } = useWindowScroll()

    return { x, y }
  },
}
```
