---
category: Array
---

# useArrayGroupBy

Reactive array grouping.

## Usage

### Use with reactive array

```ts
import { useArrayGroupBy } from '@vueuse/core'

const list = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
const result = useArrayGroupBy(list, (value) => {
  return value % 2 === 0 ? 'even' : 'odd'
})

// result.value: { even: [2, 4, 6, 8, 10], odd: [1, 3, 5, 7, 9] }
```

### Use with array of multiple refs

```ts
import { useArrayGroupBy } from '@vueuse/core'

const item1 = ref(0)
const item2 = ref(1)
const item3 = ref(2)
const item4 = ref(3)
const item5 = ref(4)
const list = [item1, item2, item3, item4, item5]
const result = useArrayGroupBy(list, (value) => {
  return value % 2 === 0 ? 'even' : 'odd'
})

// result.value: { even: [0, 2, 4], odd: [1, 3] }
```
