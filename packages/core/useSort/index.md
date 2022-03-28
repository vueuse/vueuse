---
category: Sort
---

# useSort

reactive sort array

## Usage

```ts
import { quickSort, useSort } from '@vueuse/core'

// general sort
const sorted = useSort([10, 3, 5, 7, 2, 1, 8, 6, 9, 4])

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
const objSorted = useSort(objArr, quickSort, {
  compareFn: (a, b) => a.age - b.age,
})
```

### useSortWrapFn

```ts
const wrapFn = useSortWrapFn<User>(quickSort, {
  compareFn: (a, b) => a.age - b.age,
})
const sorted = wrapFn(objArr)

// or
const wrapFn = useSortWrapFn<User>(quickSort)
const sorted = wrapFn(objArr, {
  compareFn: (a, b) => a.age - b.age,
})
```
