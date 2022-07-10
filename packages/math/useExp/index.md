---
category: '@Math'
---

# useExp

Reactively returns `e^x`, where `x` is the argument.

## Usage

```ts
import { useExp } from '@vueuse/math'

const value = ref(1)
const result = useExp(value) // 2.718281828459045
```
