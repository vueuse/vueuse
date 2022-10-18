---
category: Browser
---

# useMountedEffect

Merge `onMounted` and `onBeforeUnmount`.

## Usage

```ts
import { useMountedEffect } from '@vueuse/core'

useMountedEffect(() => {
  // ...onMounted code.
  return () => {
  // ...onBeforeUnmount code.
  }
})

useMountedEffect(async () => {
  // ...onMounted code.
  return () => {
  // ...onBeforeUnmount code.
  }
})
```
