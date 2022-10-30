---
category: Array
---

# useUnique

reactive unique array

## Usage

```ts
import { useUnique } from '@vueuse/core'

// general unique
const source = [2, 2, 3, 4, 5, 6, 7, 7, 8, 10, 10]
const sorted = useUnique(source)
console.log(sorted.value) // [2, 3, 4, 5, 6, 7, 8, 10]
```
