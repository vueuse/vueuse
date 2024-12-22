---
category: '@Math'
alias: not
---

# logicNot

`NOT` condition for ref.

## Usage

```ts
import { whenever } from '@vueuse/core'
import { logicNot } from '@vueuse/math'

const a = ref(true)

whenever(logicNot(a), () => {
  console.log('a is now falsy!')
})
```
