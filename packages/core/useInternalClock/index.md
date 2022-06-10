---
category: Animation
related:
  - useInterval
  - useIntervalFn
---

# useInternalClock

Basic internal clock that ticks every second

## Basic Usage

```ts
import { useInternalClock } from '.'

const { currentTime } = useInternalClock()
```

## Advanced Usage

If you would like more precision tp the internal clock, you can use the `tickRate` option:

```ts
import { useInternalClock } from '.'

// Will update the ticking clock every 100 milliseconds
const { currentTime } = useInternalClock({ tickRate: 100 })
```

You can also use the `pause` and `stop` methods to pause and stop the clock:

```ts
import { useInternalClock } from '.'

// Will update the ticking clock every 100 milliseconds
const { pause, resume, currentTime } = useInternalClock()

// Puase the clock:
pause()

// Resume the clock, picking up on current time:
resume()
```
