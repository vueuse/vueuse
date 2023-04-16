---
category: Array
---

# useArrayChunk

Reactive array chunking.

## Usage

### Use with reactive array

```ts
import { useArrayChunk } from '@vueuse/core'

const list = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
const result = useArrayChunk(list, 3)
// result.value: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]
```

### Use with array of multiple refs

```ts
import { useArrayChunk } from '@vueuse/core'

const item1 = ref(0)
const item2 = ref(1)
const item3 = ref(2)
const item4 = ref(3)
const item5 = ref(4)
const list = [item1, item2, item3, item4, item5]
const result = useArrayChunk(list, 2)
// result.value: [[0, 1], [2, 3], [4]]
```
