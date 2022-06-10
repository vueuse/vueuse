---
category: Animation
related:
  - useInterval
  - useIntervalFn
---

# useInternalClock

Basic internal clock that ticks every second

## Usage

```ts
import { useInternalClock } from '.'

const { currentTime } = useInternalClock({ tickRate: 100 })
```
