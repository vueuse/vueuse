---
category: '@Math'
alias: mul, multiply
related: numericAdd, numericSubtract, numericDivide
---

# numericMultiply

Numeric multiplication for refs.

## Usage

```ts
import { numericMultiply } from '@vueuse/math'

const a = ref(42)
const b = ref(2)

const sum = numericMultiply(a, b)

console.log(sum.value) // 21
a.value = 3
console.log(sum.value) // 14
```
