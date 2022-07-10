---
category: '@Math'
alias: add
related: numericSubtract, numericMultiply, numericDivide
---

# numericAdd

Numeric addition for refs.

## Usage

```ts
import { numericAdd } from '@vueuse/math'

const a = ref(20)
const b = ref(20)

const sum = numericAdd(a, b)

console.log(sum.value) // 40
a.value += 2
console.log(sum.value) // 42
```
