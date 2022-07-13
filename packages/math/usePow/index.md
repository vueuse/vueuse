---
category: '@Math'
---

# usePow

Reactive `Math.pow`.

## Usage

```ts
import { usePow } from '@vueuse/math'

const base = ref(7)
const exponent = ref(3)
const result = usePow(base, exponent) // 343
```
