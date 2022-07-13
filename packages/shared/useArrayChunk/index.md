---
category: Utilities
---

# useArrayChunk

Split array into groups the length of `size`.

## Usage

```js
import { useArrayChunk } from '@vueuse/core'

const array = ref([1, 2, 3, 4])

const chunk1 = useArrayChunk(array) // Ref<[[1], [2], [3], [4]]>

const chunk2 = useArrayChunk(array, 2) // Ref<[[1, 2], [3, 4]]>

const chunk3 = useArrayChunk(array, 3) // Ref<[[1, 2, 3], [4]]>
```
