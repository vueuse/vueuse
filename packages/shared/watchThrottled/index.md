---
category: Watch
alias: throttledWatch
---

# watchThrottled

Throttled watch.

## Usage

Similar to `watch`, but offering an extra option `throttle` which will be applied to the callback function.

```ts
import { watchThrottled } from '@vueuse/core'

watchThrottled(
  source,
  () => { console.log('changed!') },
  { throttle: 500 },
)
```

It's essentially a shorthand for the following code:

```ts
import { throttleFilter, watchWithFilter } from '@vueuse/core'

watchWithFilter(
  source,
  () => { console.log('changed!') },
  {
    eventFilter: throttleFilter(500),
  },
)
```
