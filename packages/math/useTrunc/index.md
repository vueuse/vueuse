---
category: '@Math'
---

# useTrunk

Reactively Math.trunk(value).

## Usage

```ts
import { useTrunk } from '@vueuse/math'

const value1 = ref(0.95)
const value2 = ref(-2.34)
const result1 = useTrunk(value1) // 0
const result2 = useTrunk(value2) // -2
```
