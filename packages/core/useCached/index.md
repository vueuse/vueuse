---
category: Utilities
---

# useCached

Cache a ref with a custom comparator.

## Usage

```ts
import { useCached } from '@vueuse/core'

interface Data {
  value: number
  extra: number
}

const source = ref<Data>({ value: 42, extra: 0 })
const cached = useCached(source, (a, b) => a.value === b.value)

source.value = {
  value: 42,
  extra: 1,
}

console.log(cached.value) // { value: 42, extra: 0 }

source.value = {
  value: 43,
  extra: 1,
}

console.log(cached.value) // { value: 43, extra: 1 }
```
