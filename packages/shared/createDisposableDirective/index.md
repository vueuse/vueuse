---
category: Utilities
---

# createDisposableDirective

Utility for authoring disposable directives. Reactive effects created within `mounted` directive hook will be tracked and automatically disposed when directive is unmounted.

## Usage

Creating a directive that uses `createDisposableDirective`

```ts
import { useMouse } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'

export const VDirective = createDisposableDirective({
  mounted(el, binding) {
    const value = binding.value
    if (typeof value === 'function') {
      // `useMouse` event listener will be removed automatically when directive is unmounted
      const { x, y } = useMouse()
      watch(x, val => value(val))
    }
  }
})
```
