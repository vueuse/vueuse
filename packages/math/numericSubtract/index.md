---
category: '@Math'
alias: sub, subtract
related: numericAdd, numericMultiply, numericDivide
---

# numericSubtract

Numeric subtraction for refs.

## Usage

```ts
import { numericSubtract } from '@vueuse/math'

const a = ref(12)
const b = ref(3)

const sum = numericSubtract(a, b)

console.log(sum.value) // 9
b.value += 2
console.log(sum.value) // 7
```
