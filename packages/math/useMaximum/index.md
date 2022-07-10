---
category: '@Math'
alias: useMax
related: useMinimum
---

# useMaximum

Reactively get maximum of values.

## Usage

```ts
import { useMaximum } from '@vueuse/math'

const min1 = ref(10)
const min2 = ref(20)
const result = useMaximum(min1, min2)
// result.value is 20
min2.value = 50
// result.value is 50 now
```
