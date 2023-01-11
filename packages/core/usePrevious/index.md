---
category: State
---

# usePrevious

A Hook to return the previous state.

## Usage

```js
import { usePrevious } from '@vueuse/core'

const count = ref(0)
const prevCount = usePrevious(count)

count.value++
console.log(prevCount.value) // 0

count.value++
console.log(prevCount.value) // 1
```
