---
category: '@Math'
---

# useMax

Reactively access a value no greater than max.

## Usage

```ts
import { useMax } from '@vueuse/math'

const max = ref(10)
const value = useClamp(0, max)
```
