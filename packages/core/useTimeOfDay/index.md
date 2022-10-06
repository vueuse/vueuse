---
category: Unknown
---

# useTimeOfDay

Determine the time of day in reactively.

## Usage

```ts
import { useTimeOfDay } from '@vueuse/core'

const { timeOfDay } = useTimeOfDay()
```

### With Custom Date

Optionally pass a custom date as first parameter. This could be a date ref or a plain instance of the Date object. It'll determine the timeOfDay using the custom date reactively

```ts
import { useTimeOfDay } from '@vueuse/core'

// with custom date
const customDate = new Date('Wednesday, October 5, 2022 11:55:01 PM')
const { timeOfDay } = useTimeOfDay(customDate)

console.log(timeOfDay.value) // Night
```

### Using Specific Checks

`useTimeOfDay` also exposes five(5) specific checkers that returns a boolean as computed ref depending of the time of day
```ts
import { useTimeOfDay } from '@vueuse/core'

// with custom date
const customDate = new Date('Wednesday, October 5, 2022 11:55:01 PM')

// destructure what you need
const { isMorning, isNoon, isAfternoon, isEvening, isNight } = useTimeOfDay(customDate)

console.log(isMorning.value) // false
console.log(isNoon.value) // false
console.log(isAfternoon.value) // false
console.log(isEvening.value) // false
console.log(isNight.value) // true
```
