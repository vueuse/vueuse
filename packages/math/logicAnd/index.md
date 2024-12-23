---
category: '@Math'
alias: and
related: logicNot, logicOr
---

# logicAnd

`AND` condition for refs.

## Usage

```ts
import { whenever } from '@vueuse/core'
import { logicAnd } from '@vueuse/math'

const a = ref(true)
const b = ref(false)

whenever(logicAnd(a, b), () => {
  console.log('both a and b are now truthy!')
})
```
