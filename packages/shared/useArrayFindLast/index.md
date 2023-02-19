---
category: Array
---

# useArrayFindLast

Reactive `Array.findLast`.

## Usage

```js
import { useArrayFindLast } from '@vueuse/core'

const list = [ref(1), ref(-1), ref(2)]
const positive = useArrayFindLast(list, val => val > 0)
// positive.value: 2
```

### Use with reactive array

```js
import { useArrayFindLast } from '@vueuse/core'

const list = reactive([-1, -2])
const positive = useArrayFindLast(list, val => val > 0)
// positive.value: undefined
list.push(10)
// positive.value: 10
list.push(5)
// positive.value: 5
```
