---
category: Utilities
---

# useClamp

Reactively clamp a value between two other values.

## Usage

```ts
import { useClamp } from '@vueuse/core'

const min = ref(0)
const max = ref(10)
const value = useClamp(0, min, max)
```
