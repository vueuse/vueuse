---
category: Watch
---

# throttledWatch

Throttled watch.

## Usage

Similar to `watch`, but offering an extra option `throttle` which will be applied to the callback function.

```ts
import { throttledWatch } from '@vueuse/core'

throttledWatch(
  source,
  () => { console.log('changed!') },
  { throttle: 500 }
)
```

It's essentially a shorthand for the following code:

```ts
import { watchWithFilter, throttleFilter } from '@vueuse/core'

watchWithFilter(
  source,
  () => { console.log('changed!') },
  {
    eventFilter: throttleFilter(500),
  }
)
```
