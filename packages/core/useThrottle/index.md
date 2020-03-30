# useThrottle

> Throttle changing of a ref value.

## Usage

```jsx {5,16}
import { useThrottle } from '@vueuse/core'

// in setup()
const input = ref('')
const throttled = useThrottle(input, 1000)
```
