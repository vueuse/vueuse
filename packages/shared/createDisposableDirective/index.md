---
category: Utilities
---

# createDisposableDirective

Utility for createing a disposable directive

## Usage

Creating a directive that uses `createDisposableDirective`

```ts
import { useMouse } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'

export const VDirective = createDisposableDirective({
  mounted(el, binding) {
    const value = binding.value
    if (typeof value === 'function') {
      const { x, y } = useMouse()
      watch(x, val => value(val))
    }
  }
})
```
