---
category: Watch
---

# watchWithCount

`watch` with the number of times triggered.

## Usage

Similar to `watch`, but offering an extra option `max` which setup the number of times the callback function is triggered.

```ts
import { watchWithCount } from '@vueuse/core'

watchWithCount(
  source,
  () => { console.log('trigger!') }, // triggered it 3 times
  {
    max: 3, // the number of times triggered
  }
)
```
