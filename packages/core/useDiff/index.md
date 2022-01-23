---
category: Utilities
---

# useDiff

Cache the result of a ref. And allows to specify the comparator.

## Usage

```ts
import { useDiff } from '@vueuse/core'

interface Value {
  value: number
  extra: number
}

const value = ref<Value>({ value: 42, extra: 0 })
const comparator = (a: Value, b: Value) => a.value === b.value
const cachedValue = useDiff(value, comparator)

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
