---
category: Utilities
---

# useThrottledRefHistory

Same as [useRefHistory](https://vueuse.org/core/useRefHistory/) but with throttle effect.

## Usage
This function takes the first snapshot right after the value of the counter was changed and the second with a delay of 1000ms.

```ts
import { ref } from 'vue' 
import { useThrottledRefHistory } from '@vueuse/core'

const counter = ref(0)
const { history, undo, redo } = useThrottledRefHistory(counter, { deep: true, }, 1000)
```
## Related Functions

- `useRefHistory`