---
category: Component
---

# useReactiveRefs

> Use reactive $refs in Vue 2,3

## Usage

```ts
import { useReactiveRefs } from '@vueuse/core'

export default {
  setup(props, { emit }) {
    const $target = ref<HTMLElement | null>(null)
    useReactiveRefs({ $target })

    // use string ref
    return () => <div ref="$target"></div>
  },
}
```
