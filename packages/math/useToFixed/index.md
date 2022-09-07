---
category: '@Math'
deprecated: true
---

::: warning
**Deprecated**. Please use `usePrecision` instead.
:::

# useToFixed

Reactive `toFixed`.

## Usage

```ts
import { useToFixed } from '@vueuse/math'

const value = ref(3.1415)
const result = useToFixed(value, 2) // 3.14

const stringResult = useToFixed(value, 5, {
  type: 'string'
}) // '3.14150'

const ceilResult = useToFixed(value, 2, {
  math: 'ceil'
}) // 3.15

const floorResult = useToFixed(value, 3, {
  math: 'floor'
}) // 3.141
```
