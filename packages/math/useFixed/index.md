---
category: '@Math'
---

# useFloor

Reactive `toFixed`.

## Usage

```ts
import { useFixed } from '@vueuse/math'

const value = ref(3.1415)
const result = useFixed(value, 2) // 3.14

const stringResult = useFixed(value, 5, {
  type: 'string'
}) // '3.14150'

const ceilResult = useFixed(value, 2, {
  math: 'ceil'
}) // 3.15

const floorResult = useFixed(value, 3, {
  math: 'floor'
}) // 3.141
```
