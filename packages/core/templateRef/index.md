---
category: Component
---

# templateRef

> Use reactive $refs in Vue 2,3

## Usage

```ts
import { templateRef } from '@vueuse/core'

export default {
  setup(props, { emit }) {
    const $target = templateRef<HTMLElement | null>('target', null)

    // use string ref
    return () => <div ref="target"></div>
  },
}
```
