---
category: Time
---

# useTimer

Reactive timer with support for [multiple time formats](https://www.w3.org/TR/NOTE-datetime), callback on time over, as well as returning days, hours, minutes, and seconds remaining individually. It also exposes start, pause and reset methods allowing a more flexible usage of the composable.

## Basic usage

```ts
import { useTimer } from '@vueuse/core'

const initialTime = ref(30)

// Default format mm:ss
const { start, pause, reset, status, timer } = useTimer(initialTime)
```

```ts
const {
  days,
  hours,
  minutes,
  seconds,
} = useTimer(10, { immediate: true })
```

## Callback usage
```ts
const { timer } = useTimer(10, {
  immediate: true,
  onTimerEnd: () => {
    console.log('time over')
  },
})
```
## Options
- immediate -> Start the timer immediately
- onTimerEnd -> Function called when the timer ends
- format -> timer format

## Formats
days, hours, minutes, seconds
- DD:hh:mm:ss 
- hh:mm:ss
- mm:ss
- ss 

## Statuses

- RUNNING -> The timer is active
- STOPPED -> The timer is not started 
- PAUSED -> The timer is paused
- FINISHED -> The timer is finished
