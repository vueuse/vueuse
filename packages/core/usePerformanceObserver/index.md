---
category: Browser
---

# usePerformanceObserver

Observe performance metrics.

## Usage

```ts
import { usePerformanceObserver } from '@vueuse/core'
import { ref } from 'vue'

const entrys = ref<PerformanceEntry[]>([])
usePerformanceObserver({
  entryTypes: ['paint'],
}, (list) => {
  entrys.value = list.getEntries()
})
```
