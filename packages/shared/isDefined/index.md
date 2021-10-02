---
category: Utilities
---

# isDefined

Check that a ref's `value` is defined (not `undefined` or `null`).

## Usage

```ts
import { isDefined } from '@vueuse/core'

const example = ref(Math.random() ? 'example' : undefined) // Ref<string | undefined>

if (isDefined(example)) {
  example // Ref<string>
}
```
