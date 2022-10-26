---
category: Array
---

# useSafeArrayIndex

Make sure the index does not exceed the range of the array.

## Usage

```ts
import { ref } from 'vue'
import { useSafeArrayIndex } from '@vueuse/core'

const arr = ref(['a', 'b', 'c'])
const index = useSafeArrayIndex(arr)

index.value = 999
console.log(index.value) // 2

arr.value.splice(0, 1)
console.log(index.value) // 1
```
