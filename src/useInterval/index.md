# useInterval

Reactive counter with every interval fired

## Usage

```jsx {3}
import { useInterval } from '@vueuse/core'

const Demo = createComponent({
  setup () {
    const counter = useInterval(200) // count will increase every 200ms

    return {
      counter,
    }
  },
})
```
