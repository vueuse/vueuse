---
category: State
---

# useLastChanged

Records the timestamp of the last change

## Usage

```ts
import { useLastChanged } from '@vueuse/core'
import { nextTick } from 'vue-demi'

const a = ref(0)

const lastChanged = useLastChanged(a)

a.value = 1

await nextTick()

console.log(lastChanged.value)
```
