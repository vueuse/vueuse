---
category: '@Math'
---

# useTrunc

Reactive `Math.trunc`.

## Usage

```ts
import { useTrunc } from '@vueuse/math'

const value1 = ref(0.95)
const value2 = ref(-2.34)
const result1 = useTrunc(value1) // 0
const result2 = useTrunc(value2) // -2
```
