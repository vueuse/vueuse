---
category: Utilities
---

<!--DEMO_STARTS--><!--DEMO_ENDS-->

<!--HEAD_STARTS--><!--HEAD_ENDS-->

# get

> Shorthand for accessing `ref.value`

## Usage

```ts
import { get } from '@vueuse/core'

const a = ref(42)

console.log(get(a)) // 42
```