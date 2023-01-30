---
category: '@Math'
---

# useMultiply

Reactively calculates the product of two numbers

## Usage

```ts
import { useMultiply } from '@vueuse/math'

const a = ref(2)
const b = ref(3)
const result = useMultiply(a, b) // 6

a.value = 4
result.value // 12
```
