# useIntervalFn

Simple wrapper for `setInterval`

## Usage

```jsx
import { useIntervalFn } from '@vueuse/core'

const Demo = createComponent({
  setup () {
    const counter = ref(0)

    const { start, stop } = useIntervalFn(() => {
      counter.value++
    }, 1000)

    return {
      counter,
    }
  },
})
```
