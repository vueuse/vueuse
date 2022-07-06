---
category: Watch
---

# watchAtMost

`watch` with the number of times triggered.

## Usage

Similar to `watch` with an extra option `count` which set up the number of times the callback function is triggered. After the count is reached, the watch will be stopped automatically.

```ts
import { watchAtMost } from '@vueuse/core'

watchAtMost(
  source,
  () => { console.log('trigger!') }, // triggered it at most 3 times
  {
    count: 3, // the number of times triggered
  },
)
```
