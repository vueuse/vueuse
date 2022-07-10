---
category: '@Math'
---

# useExp

Reactively Math.exp(value).

## Usage

```ts
import { useExp } from '@vueuse/math'

const value2 = ref(0)
const value3 = ref(1)
const result2 = useExp(value2) // 1
const result3 = useExp(value2) // Math.E ≈ 2.718281828459045
```
