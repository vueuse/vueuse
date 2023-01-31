---
category: Array
---

# useArrayLength

Reactive `Array.length`

## Usage

### Use with reactive array

```js
import { useArrayLength } from '@vueuse/core'
const list = ref([1, 2, 3, 4, 5])
const result = useArrayLength(list)
// result.value: 5
list.value.push(6)
// result.value: 6
list.value = [1, 2]
// result.value: 2
```
