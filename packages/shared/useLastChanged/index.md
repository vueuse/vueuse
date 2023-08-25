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

console.log(lastChanged.value) // 0
```

By default the change is recorded on the next tick (`watch()` with `flush: 'post'`). If you want to record the change immediately, pass `flush: 'sync'` as the second argument.


```ts
import { useLastChanged } from '@vueuse/core'

const a = ref(0)
const lastChanged = useLastChanged(a, { flush: 'sync' })

a.value = 1

console.log(lastChanged.value) // 0
```
