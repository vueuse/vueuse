---
category: Watch
---

# watchListChange

`watchListChange` watches for the additions and removals in a list.

## Usage

Similar to `watch`, but provides the added and removed elements to the callback function. Pass `{ deep: true }` if the list is updated in place with `push`, `splice`, etc.

```ts
import { watchListChanges } from '@vueuse/core'

const list = ref([1, 2, 3])

watchListChanges(list, (newList, oldList, added, removed) => {
  console.log(newList) // [1, 2, 3, 4]
  console.log(oldList) // [1, 2, 3]
  console.log(added) // [4]
  console.log(removed) // []
})

onMounted(() => {
  list.value = [...list.value, 4]
})
```
