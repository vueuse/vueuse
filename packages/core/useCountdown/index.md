---
category: Time
---

# useCountdown

Wrapper for `useIntervalFn` that provides a countdown timer.

## Usage

```js
import { useCountdown } from '@vueuse/core'

const countdownSeconds = 5
const { remaining, start, stop, pause, resume } = useCountdown(countdownSeconds, {
  onComplete() {

  },
  onTick() {

  }
})
```
