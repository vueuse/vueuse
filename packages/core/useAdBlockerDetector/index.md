---
category: Sensors
---

# useCounter

Detect if the use has or has not an Ad blocker.

## Usage

```ts
import { ref } from 'vue'
import { useAdBlockerDetector } from '@vueuse/core'

const hasBlockerDetector = ref(false)
useAdBlockerDetector().then(abd => hasBlockerDetector.value = abd.value)
```
