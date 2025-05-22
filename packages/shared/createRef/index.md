---
category: Reactivity
---

# createRef

Returns a `deepRef` or `shallowRef` depending on the `deep` param.

## Usage

```ts
import { createRef } from '@vueuse/core'
import { isShallow, ref } from 'vue'

const initialData = 1

const shallowData = createRef(initialData)
const deepData = createRef(initialData, true)

isShallow(shallowData) // true
isShallow(deepData) // false
```
