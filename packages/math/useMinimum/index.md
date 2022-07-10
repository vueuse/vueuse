---
category: '@Math'
---

# useMinimum

Reactively get minimum of values.

## Usage

```ts
import { useMinimum } from '@vueuse/math'

const min1 = ref(10)
const min2 = ref(20)
const result = useMinimum(min1, min2)
// result.value is 10
min2.value = 5
// result.value is 5 now
```
