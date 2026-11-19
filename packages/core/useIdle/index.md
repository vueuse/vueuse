---
category: Sensors
---

# useIdle

Tracks whether the user is being inactive.

## Usage

```ts
import { useIdle } from '@vueuse/core'

const { idle, lastActive } = useIdle(5 * 60 * 1000) // 5 min

console.log(idle.value) // true or false
```

Programatically resetting:

```ts
import { useCounter, useIdle } from '@vueuse/core'
import { watch } from 'vue'

const { inc, count } = useCounter()

const { idle, lastActive, reset } = useIdle(5 * 60 * 1000) // 5 min

watch(idle, (idleValue) => {
  if (idleValue) {
    inc()
    console.log(`Triggered ${count.value} times`)
    reset() // restarts the idle timer. Does not change lastActive value
    // reset(true) // also sets lastActive to now
  }
})
```

## Initial Values

Before the first timeout, `idle` is `false` and `lastActive` is the time `useIdle` was called. Set your own initial values with `initials`, e.g. to restore the last activity:

```ts
import { useIdle } from '@vueuse/core'

declare const storedLastActive: number
// ---cut---
const { idle, lastActive } = useIdle(5 * 60 * 1000, {
  initials: { idle: true, lastActive: storedLastActive },
})
```

`stop()` resets `idle` to its initial value. The returned refs are readonly. To own the state, pass your own refs to `initials`, `useIdle` writes into them.

## Component Usage

```vue
<template>
  <UseIdle v-slot="{ idle }" :timeout="5 * 60 * 1000">
    Is Idle: {{ idle }}
  </UseIdle>
</template>
```
