---
category: Component
---

# templateRef

> Use template ref in Vue 2, 3

## Usage

```tsx
import { templateRef } from '@vueuse/core'

export default {
  setup(props, { emit }) {
    const $target = templateRef<HTMLElement | null>('target', null)

    // use string ref
    return () => <div ref="target"></div>
  },
}
```
