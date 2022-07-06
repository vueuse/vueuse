---
category: Watch
---

# watchArray

Watch for an array with additions and removals.

## Usage

Similar to `watch`, but provides the added and removed elements to the callback function. Pass `{ deep: true }` if the list is updated in place with `push`, `splice`, etc.

```ts
import { watchArray } from '@vueuse/core'

const list = ref([1, 2, 3])

watchArray(list, (newList, oldList, added, removed) => {
  console.log(newList) // [1, 2, 3, 4]
  console.log(oldList) // [1, 2, 3]
  console.log(added) // [4]
  console.log(removed) // []
})

onMounted(() => {
  list.value = [...list.value, 4]
})
```
