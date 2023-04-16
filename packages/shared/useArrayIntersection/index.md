---
category: Array
---

# useArrayIntersection

Reactive get the intersection of two arrays.

## Usage

### Use with arrays of reactive values

```ts
import { useArrayIntersection } from '@vueuse/core'

const item1 = ref(1)
const item2 = ref(2)
const item3 = ref(3)
const item4 = ref(4)
const item5 = ref(5)
const item6 = ref(6)

const list1 = ref([item1, item2, item3, item4, item5])
const list2 = ref([item4, item5, item6])
const result = useArrayIntersection(list1, list2)
// result.value: [4, 5]
list2.value = [item1, item2, item3]
// result.value: [1, 2, 3]
```


### Use with reactive arrays

```js
import { useArrayIntersection } from '@vueuse/core'

const list1 = ref([0, 1, 2, 3, 4, 5])
const list2 = ref([4, 5, 6])
const result = useArrayIntersection(list1, list2)
// result.value: [4, 5]
list2.value = [0, 1, 2]
// result.value: [0, 1, 2]
```

### Use with reactive arrays and use function comparison

```js
import { useArrayIntersection } from '@vueuse/core'

const list1 = ref([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }])
const list2 = ref([{ id: 4 }, { id: 5 }, { id: 6 }])

const result = useArrayIntersection(list1, list2, (value, othVal) => value.id === othVal.id)
// result.value: [{ id: 4 }, { id: 5 }]
```
