---
category: '@Math'
alias: or
related: logicAnd, logicNot
---

# logicOr

`OR` conditions for refs.

## Usage

```ts
import { whenever } from '@vueuse/core'
import { logicOr } from '@vueuse/math'

const a = ref(true)
const b = ref(false)

whenever(logicOr(a, b), () => {
  console.log('either a or b is truthy!')
})
```
