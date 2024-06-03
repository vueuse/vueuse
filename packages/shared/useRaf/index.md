---
category: Utilities
---

# useRaf

Execute a callback on the next available animation frame

## Usage

```js
import { useRaf } from '@vueuse/core'

const ready = useRaf((timestamp) => {
  /* ... */
})
```

```js
const { cancel, request } = useRaf((_ts, counter) => {
  // Will only log once with counter=100 even though request was called 100 times
  console.log(`Executed request ${counter}`)
}, { debounce: true })

for (let i = 0; i <= 100; i++) {
  // Ensure call to request is executed asynchronously
  setTimeout(() => request(i), 0)
}
```
