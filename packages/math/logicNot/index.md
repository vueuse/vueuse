---
category: '@Math'
alias: not
---

# logicNot

`NOT` condition for ref.

## Usage

```ts
import { logicNot } from '@vueuse/math'
import { whenever } from '@vueuse/core'

const a = ref(true)

whenever(logicNot(a), () => {
  console.log('a is now falsy!')
})
```
