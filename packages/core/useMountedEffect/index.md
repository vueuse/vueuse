---
category: Browser
---

# useMountedEffect

Merge `onMounted` and `onBeforeUnmount`.

## Usage

```ts
import { onMountedEffect } from '@vueuse/core'

onMountedEffect(() => {
  // ...onMounted code.
  return () => {
  // ...onBeforeUnmount code.
  }
})

onMountedEffect(async () => {
  // ...onMounted code.
  return () => {
  // ...onBeforeUnmount code.
  }
})
```
