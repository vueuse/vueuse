---
category: Reactivity
---

# watchPromise

Watch with saving async functions call order.

## Usage

```js
import { watchPromise } from '@vueuse/core'

const source = ref(0)

function asyncFn() {
  return new Promise(() => {})
}

const { current, cleanQueue } = watchPromise(source, cb)

source.value = 1

console.log(current.value) // 1
```
