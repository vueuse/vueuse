---
category: Utilities
---

# and

`AND` condition for refs.

## Usage

```ts
import { and } from '@vueuse/core'

const a = ref(true)
const b = ref(false)

whenever(and(a, b), () => {
  console.log('both a and b are now truthy!')
})
```

## Related Functions

- `or`
- `not`
- `whenever`
