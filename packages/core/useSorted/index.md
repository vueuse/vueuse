---
category: Sort
---

# useSorted

reactive sort array

## Usage

```ts
import { quickSort, useSorted } from '@vueuse/core'

// general sort
const sorted = useSorted([10, 3, 5, 7, 2, 1, 8, 6, 9, 4])

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
const objSorted = useSorted(objArr, quickSort, {
  compareFn: (a, b) => a.age - b.age,
})
```

### useSortedWrapFn

```ts
const wrapFn = useSortedWrapFn<User>(quickSort, {
  compareFn: (a, b) => a.age - b.age,
})
const sorted = wrapFn(objArr)

// or
const wrapFn = useSortedWrapFn<User>(quickSort)
const sorted = wrapFn(objArr, {
  compareFn: (a, b) => a.age - b.age,
})
```
