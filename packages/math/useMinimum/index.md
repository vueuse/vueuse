---
category: '@Math'
---

# useMinimum

Reactively access a value no greater than max.

## Usage

```ts
import { useMinimum } from '@vueuse/math'

const other = ref(10)
const value = useMinimum(0, other)
```
