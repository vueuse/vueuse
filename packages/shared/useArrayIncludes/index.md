---
category: Array
---

# useArrayIncludes

Reactive `Array.includes`

## Usage

### Use with reactive array

```js
import { useArrayIncludes } from '@vueuse/core'
const list = ref([0, 2, 4, 6, 8])
const result = useArrayIncludes(list, 10)
// result.value: false
list.value.push(10)
// result.value: true
list.value.pop()
// result.value: false
```
