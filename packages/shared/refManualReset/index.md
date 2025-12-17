---
category: Reactivity
---

# refManualReset

Create a ref with manual reset functionality.

## Usage

```ts
import { refManualReset } from '@vueuse/core'

const message = refManualReset('default message')

message.value = 'message has set'

message.reset()

console.log(message.value) // 'default message'
```

> **Note**: `refManualReset` is shallow, which may cause your UI not updated on value changes.
> Wrap your value with `reactive` can achieve deep reactivity, but this workaround may not suit all use cases.
