---
category: Time
---

# useTemporal

Reactive [Temporal API](https://tc39.es/proposal-temporal/docs/) with timezone conversion and calendar system support.

Uses the modern Temporal API instead of the legacy `Date` object, providing better timezone handling, calendar systems, and date/time operations.

## Requirements

This function relies on the [`Temporal`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal) API. It does **not** bundle or depend on any Temporal implementation — by default it reads the global `Temporal` object, but you can also pass your own implementation via the `temporal` option.

- Modern JS engines (recent Node.js, Deno, and browsers) already expose `Temporal` natively, or will soon.
- For environments without native support, install a polyfill yourself, for example [`temporal-polyfill`](https://github.com/fullcalendar/temporal-polyfill):

  ```bash
  npm i temporal-polyfill
  ```

  and either load it once as a global, before this function is used (e.g. in your app's entry point):

  ```ts
  import 'temporal-polyfill/global'
  ```

  If you need calendar systems beyond `iso8601`/`gregory` (e.g. `islamic`, `hebrew`, `chinese`, `japanese` as used in the examples below), use the `/full/` entry point instead:

  ```ts
  import 'temporal-polyfill/full/global'
  ```

  ...or pass it explicitly via the `temporal` option instead of touching the global scope:

  ```ts
  import { useTemporal } from '@vueuse/core'
  import { Temporal } from 'temporal-polyfill'

  const temporal = useTemporal({ temporal: Temporal })
  ```

  [`@js-temporal/polyfill`](https://github.com/js-temporal/temporal-polyfill) is another common alternative. It does not install a global `Temporal` object by itself, so the `temporal` option is the natural way to use it:

  ```ts
  import { Temporal } from '@js-temporal/polyfill'
  import { useTemporal } from '@vueuse/core'

  const temporal = useTemporal({ temporal: Temporal })
  ```

If no `Temporal` implementation can be found (neither passed via the `temporal` option nor available globally), calling `useTemporal` or `createTemporal` will throw an error.

## Usage

### Basic Usage

```vue
<script setup>
import { useTemporal } from '@vueuse/core'

const { now, timezone, calendar, format } = useTemporal()

// Display current time
console.log(format()) // "12/25/2023, 3:30:00 PM"
</script>

<template>
  <div>
    <p>Current time: {{ format() }}</p>
    <p>Timezone: {{ timezone }}</p>
    <p>Calendar: {{ calendar }}</p>
  </div>
</template>
```

### Timezone Conversion

```ts
import { useTemporal } from '@vueuse/core'

const temporal = useTemporal({ timezone: 'America/New_York' })

// Convert to different timezones
const tokyoTime = temporal.toTimezone('Asia/Tokyo')
const londonTime = temporal.toTimezone('Europe/London')
const utcTime = temporal.toTimezone('UTC')

// Change timezone reactively
temporal.timezone.value = 'Europe/Berlin'
```

### Calendar Systems

```ts
import { useTemporal } from '@vueuse/core'

const temporal = useTemporal({ calendar: 'gregory' })

// Convert to different calendar systems
const islamicDate = temporal.toCalendar('islamic-umalqura')
const hebrewDate = temporal.toCalendar('hebrew')
const chineseDate = temporal.toCalendar('chinese')

// Change calendar reactively
temporal.calendar.value = 'islamic-umalqura'
```

### Date/Time Manipulation

```ts
import { useTemporal } from '@vueuse/core'

const { now, add, subtract, compare } = useTemporal()

// Add/subtract durations
const nextWeek = add('P7D') // Add 7 days
const lastMonth = subtract('P1M') // Subtract 1 month
const inTwoHours = add('PT2H') // Add 2 hours

// Compare dates
const futureDate = add('P1Y') // Add 1 year
const comparison = compare(futureDate) // -1 (now is before futureDate)
```

### Format Options

```ts
import { useTemporal } from '@vueuse/core'

const { format } = useTemporal()

// Different formatting options
const short = format({ dateStyle: 'short' }) // "12/25/23"
const long = format({ dateStyle: 'long' }) // "December 25, 2023"
const time = format({ timeStyle: 'medium' }) // "3:30:00 PM"
const custom = format({
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}) // "Monday, December 25, 2023"
```

### Control Auto-Update

```ts
import { useTemporal } from '@vueuse/core'

const { pause, resume, isActive } = useTemporal({
  interval: 500, // Update every 500ms
  immediate: false // Don't start immediately
})

// Manually control updates
resume() // Start auto-update
pause() // Stop auto-update

console.log(isActive.value) // true/false
```

### Static Temporal Utility

```ts
import { createTemporal } from '@vueuse/core'

// Create from string
const temporal1 = createTemporal('2023-12-25T15:30:00[America/New_York]')

// Create from current time with timezone
const temporal2 = createTemporal(undefined, 'Asia/Tokyo', 'japanese')

// Reactive inputs
const timezone = ref('Europe/London')
const temporal3 = createTemporal(undefined, timezone)

// Use utility functions
const formatted = temporal1.format({ dateStyle: 'full' })
const tokyoTime = temporal1.toTimezone('Asia/Tokyo')
```

## Examples

### World Clock

```vue
<script setup>
import { useTemporal } from '@vueuse/core'

const timezones = [
  { name: 'New York', tz: 'America/New_York' },
  { name: 'London', tz: 'Europe/London' },
  { name: 'Tokyo', tz: 'Asia/Tokyo' },
  { name: 'Sydney', tz: 'Australia/Sydney' }
]

const { now } = useTemporal()

const worldTimes = computed(() =>
  timezones.map(({ name, tz }) => ({
    name,
    time: now.value.withTimeZone(tz).toLocaleString()
  }))
)
</script>

<template>
  <div>
    <h2>World Clock</h2>
    <div v-for="{ name, time } in worldTimes" :key="name">
      <strong>{{ name }}:</strong> {{ time }}
    </div>
  </div>
</template>
```

### Calendar System Converter

```vue
<script setup>
import { useTemporal } from '@vueuse/core'

const { now, calendar } = useTemporal()

const calendars = ['gregory', 'islamic-umalqura', 'hebrew', 'chinese', 'japanese']

const convertedDates = computed(() =>
  calendars.map(cal => ({
    name: cal,
    date: now.value.withCalendar(cal).toPlainDate().toString()
  }))
)
</script>

<template>
  <div>
    <h2>Calendar Systems</h2>
    <select v-model="calendar">
      <option v-for="cal in calendars" :key="cal" :value="cal">
        {{ cal }}
      </option>
    </select>

    <div v-for="{ name, date } in convertedDates" :key="name">
      <strong>{{ name }}:</strong> {{ date }}
    </div>
  </div>
</template>
```
