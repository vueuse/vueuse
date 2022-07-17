---
category: Array
---

# useArrayFilter

Reactive `Array.filter`

## Usage

### Use with array of multiple refs

```js
import { useArrayFilter } from '@vueuse/core'
const item1 = ref(0)
const item2 = ref(2)
const item3 = ref(4)
const item4 = ref(6)
const item5 = ref(8)
const list = [item1, item2, item3, item4, item5]
const result = useArrayFilter(list, i => i % 2 === 0)
// result.value: [0, 2, 4, 6, 8]
item2.value = 1
// result.value: [0, 4, 6, 8]
```

### Use with reactive array

```js
import { useArrayFilter } from '@vueuse/core'
const list = ref([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
const result = useArrayFilter(list, i => i % 2 === 0)
// result.value: [0, 2, 4, 6, 8]
list.value.shift()
// result.value: [2, 4, 6, 8]
```
