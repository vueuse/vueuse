---
category: Time
---

# useTimeSpan

 Get reactive TimeSpan object that represents a time interval (duration of time or elapsed time) that is measured as a positive or negative number of days, hours, minutes, seconds, and fractions of a second.

## Usage

```ts
import { useTimeSpan } from '@vueuse/core'

const time = useTimeSpan(44711000)

console.log(time.hours.value) // 12
console.log(time.minutes.value) // 25
console.log(time.seconds.value) // 11
```
