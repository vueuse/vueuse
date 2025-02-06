---
category: Sensors
---

# useDevicePlatform

Reactively track the Operating System returned by [`navigator.userAgent`](https://developer.mozilla.org/docs/Web/API/Window/navigator)

## Usage

```js
import { useDevicePlatform } from '@vueuse/core'

export default {
  setup() {
    const os = useDevicePlatform()

    return os
  },
}
```
