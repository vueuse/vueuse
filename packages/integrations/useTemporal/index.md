---
{}
---

# useTemporal

Reactive Temporal API with timezone conversion and calendar system support.

Uses the modern [Temporal API](https://tc39.es/proposal-temporal/docs/) instead of the legacy `Date` object, providing better timezone handling, calendar systems, and date/time operations.

## Features

- 🌍 **Timezone Support** - Easy conversion between timezones
- 📅 **Calendar Systems** - Support for different calendar systems (Gregorian, Islamic, Hebrew, etc.)
- ⚡ **Reactive** - Automatically updates with configurable intervals
- 🎯 **Type Safe** - Full TypeScript support with Temporal types
- 🔧 **Utility Functions** - Rich set of date/time manipulation functions

## Usage

### Basic Usage

```vue
<script setup>
import { useTemporal } from '@vueuse/integrations'

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
import { useTemporal } from '@vueuse/integrations/useTemporal'

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
import { useTemporal } from '@vueuse/integrations'

const temporal = useTemporal({ calendar: 'gregory' })

// Convert to different calendar systems
const islamicDate = temporal.toCalendar('islamic')
const hebrewDate = temporal.toCalendar('hebrew')
const chineseDate = temporal.toCalendar('chinese')

// Change calendar reactively
temporal.calendar.value = 'islamic'
```

### Date/Time Manipulation

```ts
import { useTemporal } from '@vueuse/integrations'

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
import { useTemporal } from '@vueuse/integrations'

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
import { useTemporal } from '@vueuse/integrations'

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
import { createTemporal } from '@vueuse/integrations'

// Create from string
const temporal1 = createTemporal('2023-12-25T15:30:00[America/New_York]')

// Create from current time with timezone
const temporal2 = createTemporal(null, 'Asia/Tokyo', 'japanese')

// Reactive inputs
const timezone = ref('Europe/London')
const temporal3 = createTemporal(null, timezone)

// Use utility functions
const formatted = temporal1.format({ dateStyle: 'full' })
const tokyoTime = temporal1.toTimezone('Asia/Tokyo')
```

## Type Declarations

```ts
export interface UseTemporalOptions {
  timezone?: string
  calendar?: string
  interval?: number
  immediate?: boolean
}

export interface UseTemporalReturn {
  now: Ref<Temporal.ZonedDateTime>
  timezone: Ref<string>
  calendar: Ref<string>
  toTimezone: (tz: string) => Temporal.ZonedDateTime
  toCalendar: (cal: string) => Temporal.ZonedDateTime
  toPlainDate: () => Temporal.PlainDate
  toPlainTime: () => Temporal.PlainTime
  toPlainDateTime: () => Temporal.PlainDateTime
  format: (options?: Intl.DateTimeFormatOptions) => string
  add: (duration: Temporal.Duration | string) => Temporal.ZonedDateTime
  subtract: (duration: Temporal.Duration | string) => Temporal.ZonedDateTime
  compare: (other: Temporal.ZonedDateTime | string) => number
  pause: () => void
  resume: () => void
  isActive: Ref<boolean>
}

export function useTemporal(options?: UseTemporalOptions): UseTemporalReturn
```

## Examples

### World Clock

```vue
<script setup>
import { useTemporal } from '@vueuse/integrations'

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
import { useTemporal } from '@vueuse/integrations'

const { now, calendar } = useTemporal()

const calendars = ['gregory', 'islamic', 'hebrew', 'chinese', 'japanese']

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

## Browser Support

This composable requires the Temporal API, which is currently not widely supported in browsers. It uses the `@js-temporal/polyfill` package to provide compatibility.

For production usage, ensure the polyfill is properly loaded in your application.
