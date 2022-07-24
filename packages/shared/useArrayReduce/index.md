---
category: Array
---

# useArrayReduce

Reactive `Array.reduce`.

## Usage

```js
import { useArrayReduce } from '@vueuse/core'

const sum = useArrayReduce([ref(1), ref(2), ref(3)], (sum, val) => sum + val)
// sum.value: 6
```

### Use with reactive array

```js
import { useArrayReduce } from '@vueuse/core'

const list = reactive([1, 2])
const sum = useArrayReduce(list, (sum, val) => sum + val)

list.push(3)
// sum.value: 6
```

### Use with initialValue

```js
import { useArrayReduce } from '@vueuse/core'

const list = reactive([{ num: 1 }, { num: 2 }])
const sum = useArrayReduce(list, (sum, val) => sum + val.num, 0)
// sum.value: 3
```
