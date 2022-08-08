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

const { current, cleanQueue } = watchPromise(source, asyncFn)

// trigger watch callback
source.value = 1

// current calls in async functions queue.
console.log(current.value) // 1

// remove all callback calls from queue.
cleanQueue()
```
