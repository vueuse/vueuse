---
category: '@Math'
alias: abs
---

# useAbs

Reactively [Math.abs(value)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs).

## Usage

```ts
import { useAbs } from '@vueuse/math'

const value = ref(-23)
const absValue = useAbs(value)
```
