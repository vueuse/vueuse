---
category: '@Math'
alias: useMax
related: usemaximum
---

# useMaximum

Reactively get maximum of values.

## Usage

```ts
import { useMaximum } from '@vueuse/math'

const max1 = ref(10)
const max2 = ref(20)
const result = useMaximum(max1, max2)
// result.value is 20
max2.value = 50
// result.value is 50 now
```
