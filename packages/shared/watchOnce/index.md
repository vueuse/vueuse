---
category: Watch
---

# watchOnce

`watch` with trigger once times.

## Usage

Similar to `watch`. After the callback function triggered once times, the watch will be stopped automatically.

```ts
import { watchOnce } from '@vueuse/core'

watchOnce(
  source,
  () => { console.log('trigger!') }, // only trigger it once times
)
```
