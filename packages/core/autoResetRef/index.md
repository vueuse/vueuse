---
category: Utilities
---

# autoResetRef

A ref which will be reset to the default value after some time.

## Usage

```ts
import { autoResetRef } from '@vueuse/core'

const message = autoResetRef('default message', 1000)

const setMessage = () => {
  // here the value will change to 'message has set' but after 1000ms, it will change to 'default message'
  message.value = 'message has set'
}
```
