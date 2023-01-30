---
category: '@Math'
---

# useSubtract

Reactively calculates the difference value two numbers

## Usage

```ts
import { useSubtract } from '@vueuse/math'

const a = ref(20)
const b = ref(10)
const result = useSubtract(a, b) // 10

a.value = 10
// result.value: 0
```
