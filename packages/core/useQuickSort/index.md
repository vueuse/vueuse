---
category: Sort
---

# useQuickSort

reactive quicksort array

## Usage

```ts
import { useQuickSort } from '@vueuse/core'

// general sort
const sorted = useQuickSort([10, 3, 5, 7, 2, 1, 8, 6, 9, 4])

// object sort
const objArr = [{
  name: 'John',
  age: 40,
}, {
  name: 'Jane',
  age: 20,
}, {
  name: 'Joe',
  age: 30,
}, {
  name: 'Jenny',
  age: 22,
}]
const objSorted = useQuickSort(objArr, {
  compareFn: (a, b) => a.age - b.age,
})
```
