---
category: Browser
---

# usePerformanceRecorder

Records performance metrics.

## Usage

```ts
import { usePerformanceRecorder } from '@vueuse/core'

const entrys = ref<PerformanceEntry[]>([])
usePerformanceRecorder({
  entryTypes: ['paint'],
}, (list) => {
  entrys.value = list.getEntries()
})
```
