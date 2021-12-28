---
category: Utilities
---

# useToggle

A boolean ref with a async function.

## Usage

```js
import { useLoadingFn } from '@vueuse/core'

const [isLoading, fn] = useToggle(async() => {
  // do some thing

})
```

When you pass a ref, `useToggle` will return a simple toggle function instead:
When you call the function `isLoading` will automatically toggle
