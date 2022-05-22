---
category: Utilities
---

# useTimeoutPoll

Use timeout to poll something. It's will trigger callback after last task is done.

## Usage

```ts
import { useTimeoutPoll } from '@vueuse/core'

const count = ref(0)

const fetchData = async () => {
  await promiseTimeout(1000)
  count.value++
}

// Only trigger after last fetch is done
const { isActive, pause, resume } = useTimeoutPoll(fetchData, 1000)
```
