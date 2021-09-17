---
category: Utilities
---

# not

`NOT` condition for ref.

## Usage

```ts
import { not } from '@vueuse/core'

const a = ref(true)

whenever(not(a), () => {
  console.log('a is now falsy!')
})
```

## Related Functions

- `and`
- `or`
- `whenever`
