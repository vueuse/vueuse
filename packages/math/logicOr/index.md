---
category: '@Math'
alias: or
related: logicAnd, logicNot
---

# logicOr

`OR` conditions for refs.

## Usage

```ts
import { logicOr } from '@vueuse/math'
import { whenever } from '@vueuse/core'

const a = ref(true)
const b = ref(false)

whenever(logicOr(a, b), () => {
  console.log('either a or b is truthy!')
})
```
