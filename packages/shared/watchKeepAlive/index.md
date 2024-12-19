---
category: Watch
---

# watchKeepAlive

`watch` that only triggers when keep alive component active.

## Usage

The callback function is only triggered when the keep-alive component is active.

```ts
import { watchKeepAlive } from '@vueuse/core'

watchKeepAlive(
  source,
  () => { console.log('trigger!') }, // triggered
  options
)
```
