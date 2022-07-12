---
category: Utilities
---

# useArrayFind

Reactively array find.

## Usage

```js
import { useArrayFind } from '@vueuse/core'
const positive = useArrayFind([ref(1), ref(-1), ref(2)], val => val > 0)
// positive.value: 1
```

### Use with reactive array

```js
import { useArrayFind } from '@vueuse/core'
const list = reactive([-1, -2])
const positive = useArrayFind(list, val => val > 0)
// positive.value: undefined
list.push(1)
// positive.value: 1
```
