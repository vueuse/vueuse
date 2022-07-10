---
category: '@Math'
alias: div, divide
related: numericAdd, numericSubtract, numericMultiply
---

# numericDivide

Numeric division for refs.

## Usage

```ts
import { numericDivide } from '@vueuse/math'

const a = ref(12)
const b = ref(3)

const sum = numericDivide(a, b)

console.log(sum.value) // 4
b.value = 4
console.log(sum.value) // 3
```
