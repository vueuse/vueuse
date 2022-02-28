---
category: Utilities
alias: and
related: logicNot, logicOr
---

# logicAnd

`AND` condition for refs.

## Usage

```ts
import { logicAnd } from '@vueuse/core'

const a = ref(true)
const b = ref(false)

whenever(logicAnd(a, b), () => {
  console.log('both a and b are now truthy!')
})
```
