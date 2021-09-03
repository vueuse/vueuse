---
category: Utilities
---

# or

`OR` conditions for refs.

## Usage

```ts
import { or } from '@vueuse/core'

const a = ref(true)
const b = ref(false)

whenever(or(a, b), () => {
  console.log('either a or b is truthy!')
})
```

## Related Functions

- `and`
- `not`
- `whenever`
