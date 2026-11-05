---
category: Browser
---

# usePerformanceObserver

Observe performance metrics.

## Usage

```ts
import { usePerformanceObserver } from '@vueuse/core'

const entries = ref<PerformanceEntry[]>([])
usePerformanceObserver({
  entryTypes: ['paint'],
}, (list) => {
  entries.value = list.getEntries()
})
```
