---
category: Utilities
---

# useDebouncedRefHistory

Same as [useRefHistory](https://vueuse.org/core/useRefHistory/) but with debounse effect.

## Usage

This function takes a snapshot of your counter after 1000ms when the value of it starts to change.

```ts
import { ref } from 'vue' 
import { useDebouncedRefHistory } from '@vueuse/core'

const counter = ref(0)
const { history, undo, redo } = useDebouncedRefHistory(counter, { deep: true, debounce: 1000 })
```
## Related Functions

- `useRefHistory`