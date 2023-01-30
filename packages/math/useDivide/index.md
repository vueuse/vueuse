---
category: '@Math'
---

# useDivide

Reactively calculates the value of dividing two numbers

## Usage

```ts
import { useDivide } from '@vueuse/math'

const divide = ref(10)
const divisor = ref(2)
const result = useDivide(divide, divisor) // 5

divide.value = 20
console.log(result.value) // 10
```
