---
category: Animation
---

# useTimeout

Update value after a given time with controls.

## Usage

```js
import { useTimeout, promiseTimeout } from '@vueuse/core'

const ready = useTimeout(1000)
```

```js
const { ready, start, stop } = useTimeout(1000, { controls: true })
```

```js
console.log(ready.value) // false

await promiseTimeout(1200)

console.log(ready.value) // true
```
