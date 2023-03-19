---
category: Array
---

# useArrayDifference

Reactive get array difference of two array

## Usage

### Use with reactive array

```js
import { useArrayDifference } from '@vueuse/core'
const list1 = ref([0, 1, 2, 3, 4, 5])
const list2 = ref([4, 5, 6])
const result = useArrayDifference(list1, list2)
// result.value: [0, 1, 2, 3]
list2.value = [0, 1, 2]
// result.value: [3, 4, 5]
```

### Use with reactive array and use function comparison

```js
import { useArrayDifference } from '@vueuse/core'

const list1 = ref([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }])
const list2 = ref([{ id: 4 }, { id: 5 }, { id: 6 }])

const result = useArrayDifference(list1, list2, (value, othVal) => value.id === othVal.id)
// result.value: [{ id: 1 }, { id: 2 }, { id: 3 }]
```
