---
category: Watch
---

# watchOnce

Shorthand for watching value with `{ once: true }`. Once the callback fires once, the watcher will be stopped.
See [Vue's docs](https://vuejs.org/guide/essentials/watchers.html#once-watchers) for full details.

## Usage

Similar to `watch`, but with `{ once: true }`

```ts
import { watchOnce } from '@vueuse/core'

watchOnce(source, () => {
  // triggers only once
  console.log('source changed!')
})
```
