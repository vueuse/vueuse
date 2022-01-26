---
category: Utilities
---

# useCached

Cache the a ref with custom comparator.

## Usage

```ts
import { useCached } from '@vueuse/core'

interface Value {
  value: number
  extra: number
}

const value = ref<Value>({ value: 42, extra: 0 })
const comparator = (a: Value, b: Value) => a.value === b.value
const cachedValue = useCached(value, comparator)

value.value = {
    value: 42,
    extra: 1
}

console.log(cachedValue.value) // { value: 42, extra: 0 }

value.value = {
    value: 43,
    extra: 1
}

console.log(cachedValue.value) // { value: 43, extra: 1 }
```
