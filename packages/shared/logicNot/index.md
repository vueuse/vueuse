---
category: Utilities
alias: note
---

# logicNot

`NOT` condition for ref.

## Usage

```ts
import { logicNot } from '@vueuse/core'

const a = ref(true)

whenever(logicNot(a), () => {
  console.log('a is now falsy!')
})
```
