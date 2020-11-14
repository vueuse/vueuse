# useTimeout

> Update value after a given time with controls.

## Usage

```js
import { useTimeout, promiseTimeout } from '@vueuse/core'

const { ready, start, stop } = useTimeout(1000, true)
```

```js
console.log(ready.value) // false

await promisedTimeout(1200)

console.log(ready.value) // true
```
