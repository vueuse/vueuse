---
category: '@Math'
---

# useAverage

Get the average of an array reactively.

## Usage

```ts
import { useAverage } from '@vueuse/math'

const list = ref([1, 2, 3])
const averageValue = useAverage(list)
```
