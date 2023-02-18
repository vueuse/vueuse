---
category: Utilities
---

# usePrevious

Holds the previous value of a ref.

## Usage

```ts
import { ref } from 'vue'
import { usePrevious } from '@vueuse/core'

const counter = ref('Hello')
const previous = usePrevious(counter)

console.log(previous.value) // undefined

counter.value = 'World'

console.log(previous.value) // Hello
```
