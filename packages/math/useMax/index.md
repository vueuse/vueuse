---
category: '@Math'
---

# useMax

Reactive `Math.max`.

## Usage

```ts
import { useMax } from '@vueuse/math'

const max1 = ref(10)
const max2 = ref(20)
const result = useMax(max1, max2)
// result.value is 20

max1.value = 50
// result.value is 50 now
```
