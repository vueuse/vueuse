---
category: State
related: useDebouncedRefHistory, useRefHistory
---

# useThrottledRefHistory

Shorthand for `useRefHistory` with throttled filter.

## Usage

This function takes the first snapshot right after the counter's value was changed and the second with a delay of 1000ms.

```ts
import { ref } from 'vue'
import { useThrottledRefHistory } from '@vueuse/core'

const counter = ref(0)
const { history, undo, redo } = useThrottledRefHistory(counter, { deep: true, throttle: 1000 })
```
