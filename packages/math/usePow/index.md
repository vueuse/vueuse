---
category: '@Math'
---

# usePow

Reactively Math.pow(base,exponent).

## Usage

```ts
import { usePow } from '@vueuse/math'

const base = ref(2)
const exponent = ref(3)
const value = usePow(base, exponent)
```
