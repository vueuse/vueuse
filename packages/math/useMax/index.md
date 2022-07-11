---
category: '@Math'
---

# useMax

Reactively Math.max(value).

## Usage

```ts
import { useMax } from '@vueuse/math'

const value = ref(20)
const maximum = ref(100)
const result = useMax(value, maximum)

const value2 = ref(20)
const result2 = useMax(value)
```
