---
category: Utilities
---

# set

Shorthand for `ref.value = x`

## Usage

```ts twoslash
import { set } from '@vueuse/core'
import { ref } from 'vue'

const a = ref(0)

set(a, 1)

console.log(a.value) // 1
```
