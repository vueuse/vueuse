---
category: Sensors
---

# useIdle

Tracks whether the user is being inactive.

## Usage

```js
import { useIdle } from '@vueuse/core'

const { idle, lastActive } = useIdle(5 * 60 * 1000) // 5 min

console.log(idle.value) // true or false
```

Programatically resetting:


```js
import { watch } from 'vue'
import { useCounter, useIdle } from '@vueuse/core'

const { inc, count } = useCounter()

const { idle, lastActive, reset } = useIdle(5 * 60 * 1000) // 5 min

watch(idle, (idleValue) => {
  if (idleValue) {
    inc()
    console.log(`Triggered ${count.value} times`)
    reset() // restarts the idle timer. Does not change lastActive value
  }
})
```

## Component Usage

```html
<UseIdle v-slot="{ idle }" :timeout="5 * 60 * 1000">
  Is Idle: {{ idle }}
</UseIdle>
```
